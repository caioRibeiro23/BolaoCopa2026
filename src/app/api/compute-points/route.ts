import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Validação de Segurança (Chave Secreta)
//   const authHeader = request.headers.get('authorization');
//   const token = authHeader?.replace('Bearer ', '');

//   if (!token || token !== process.env.CRON_SECRET) {
//     return NextResponse.json(
//       { error: 'Não autorizado. Chave secreta inválida ou ausente.' },
//       { status: 401 }
//     );
//   }

  // Inicializa o Supabase com a Service Role Key para poder atualizar os perfis sem travar no RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 2. Busca todos os jogos encerrados no seu banco
    const { data: finishedMatches, error: matchesError } = await supabase
      .from('matches')
      .select('id, goals_home, goals_away')
      .eq('status', 'finished');

    if (matchesError) throw matchesError;
    if (!finishedMatches || finishedMatches.length === 0) {
      return NextResponse.json({ message: "Nenhum jogo finalizado para calcular pontos." });
    }

    let totalPalpitesProcessados = 0;

    // 3. Varre cada jogo finalizado para calcular os palpites
    for (const match of finishedMatches) {
      const resHome = match.goals_home;
      const resAway = match.goals_away;

      // Determina o resultado real do jogo (Vítoria Casa, Vitória Visitante ou Empate)
      const resultadoReal = resHome > resAway ? 'CASA' : resHome < resAway ? 'VISITANTE' : 'EMPATE';

      // Busca os palpites deste jogo que ainda não foram pontuados (points_earned igual a 0 ou nulo)
      const { data: pendingBets, error: betsError } = await supabase
        .from('bets')
        .select('id, user_id, prediction_home, prediction_away')
        .eq('match_id', match.id)
        .eq('points_earned', 0); // Considera 0 como não processado ainda

      if (betsError) console.error(`Erro ao buscar palpites do jogo ${match.id}:`, betsError.message);
      if (!pendingBets || pendingBets.length === 0) continue;

      for (const bet of pendingBets) {
        let pontosGanhos = 0;
        const palpiteHome = bet.prediction_home;
        const palpiteAway = bet.prediction_away;
        const resultadoPalpite = palpiteHome > palpiteAway ? 'CASA' : palpiteHome < palpiteAway ? 'VISITANTE' : 'EMPATE';

        // REGRA 1: Placar Exato (Ex: Jogo 3x1, Palpite 3x1) -> +3 pontos
        if (palpiteHome === resHome && palpiteAway === resAway) {
          pontosGanhos = 3;
        } 
        // REGRA 2: Acertou o resultado mas errou o placar (Ex: Jogo 2x0, Palpite 1x0) -> +1 ponto
        else if (resultadoPalpite === resultadoReal) {
          pontosGanhos = 1;
        }

        // Se o usuário ganhou pontos, precisamos atualizar o perfil dele e a aposta
        if (pontosGanhos > 0) {
          // A: Atualiza a linha do palpite com os pontos ganhos para não re-processar no futuro
          await supabase
            .from('bets')
            .update({ points_earned: pontosGanhos })
            .eq('id', bet.id);

          // B: Incrementa o total_points diretamente no perfil do usuário na tabela user_profiles
          // Como o Postgres aceita incremento nativo, usamos arpc do supabase ou uma query direta. 
          // Para simplificar sem mudar o banco, buscamos o valor atual e somamos:
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('total_points')
            .eq('id', bet.user_id)
            .single();

          const novosPontosTotais = (profile?.total_points || 0) + pontosGanhos;

          await supabase
            .from('user_profiles')
            .update({ total_points: novosPontosTotais })
            .eq('id', bet.user_id);
            
          totalPalpitesProcessados++;
        } else {
          // Se fez 0 pontos, atualiza para 0 (ou um valor marcador tipo -1 se quiser diferenciar de não-processado)
          // Vamos atualizar para manter marcado como processado
          await supabase
            .from('bets')
            .update({ points_earned: -1 }) // Usar -1 indica: "Este palpite foi computado e deu zero pontos"
            .eq('id', bet.id);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processamento concluído. ${totalPalpitesProcessados} palpites pontuados.` 
    });

  } catch (err: Error | unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}