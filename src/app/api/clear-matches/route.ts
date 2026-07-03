import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicialização com o Service Role Key para ignorar as travas de RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(request: Request) {
  // Proteção para garantir que apenas o agendador automático da Vercel execute a rota em produção
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const agora = new Date();
    
    // Alarga a janela temporal de verificação para tratar discrepâncias de fuso horário (UTC)
    // Busca qualquer partida que inicie entre o horário atual e os próximos 75 minutos
    const daquiUmaHora = new Date(agora.getTime() + 60 * 60 * 1000);
    const daquiSetentaECincoMinutos = new Date(agora.getTime() + 75 * 60 * 1000);

    // 1. Busca os jogos correspondentes à janela de tempo estabelecida
    const { data: matches } = await supabase
      .from('matches')
      .select('id, team_home, team_away, date_time')
      .gte('date_time', daquiUmaHora.toISOString()) 
      .lte('date_time', daquiSetentaECincoMinutos.toISOString());

    if (!matches || matches.length === 0) {
      return NextResponse.json({ message: "Nenhum jogo começando na próxima hora." });
    }

    for (const match of matches) {
      // 2. Busca os IDs dos usuários que já efetuaram um palpite para este jogo específico
      const { data: palpitesFeitos } = await supabase
        .from('bets')
        .select('user_id')
        .eq('match_id', match.id);

      const idsUsuariosComPalpite = palpitesFeitos?.map(b => b.user_id) || [];

      // 3. Busca na tabela correta (user_profiles) os IDs ativos ignorando quem já palpitou
      const query = supabase
        .from('user_profiles')
        .select('onesignal_player_id')
        .not('onesignal_player_id', 'is', null);

      // 🎯 SOLUÇÃO: Aplica o filtro diretamente se houver IDs, sem precisar dar reatribuição com "let"
      const { data: usuariosEsquecidos } = await (idsUsuariosComPalpite.length > 0
        ? query.not('id', 'in', idsUsuariosComPalpite)
        : query);

      const playerIds = usuariosEsquecidos?.map(u => u.onesignal_player_id).filter(Boolean) as string[];
      if (playerIds && playerIds.length > 0) {
        // 4. Dispara a requisição REST para a API global do OneSignal
        await fetch('https://onesignal.com/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
          },
          body: JSON.stringify({
            app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            include_player_ids: playerIds,
            headings: { pt: "Falta pouco! ⏳" },
            contents: { pt: `O jogo ${match.team_home} x ${match.team_away} começa em menos de 1 hora e você ainda não palpitou!` },
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bolaobolazzo.com.br'}/matches/${match.id}`
          })
        });
      }
    }

    return NextResponse.json({ success: true, message: "Lembretes processados com sucesso." });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}