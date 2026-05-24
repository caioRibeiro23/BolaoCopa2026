import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

interface FootballMatch {
  homeTeam: { name: string };
  awayTeam: { name: string };
  utcDate: string;
  status: string;
  minute?: number | string;
  time?: string;
  score: { 
    fullTime: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null } | null;
  };
  stage?: string;
  group?: string;
}

interface TransformedMatch {
  team_home: string;
  team_away: string;
  date_time: string;
  status: string;
  status_exibicao: string;
  goals_home: number | null;
  goals_away: number | null;
  phase: string;
  group_letter: string | null;
}

// Inicializa o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);



export async function GET() {

  // //bloco de verificação para poupar a API de chamadas desnecessárias
  // const agora = new Date();
  // const duasHorasDepois = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

  // // 2. Busca no banco se há jogos AO VIVO ou que começam nas próximas 2 horas
  // const { data: jogosProximos, error } = await supabase
  //   .from('matches')
  //   .select('id, status, date_time')
  //   .or(`status.eq.live,and(status.eq.scheduled,date_time.lte.${duasHorasDepois.toISOString()})`);

  // // 3. Se o banco estiver baleado ou se realmente não tiver jogo perto, poupa a API
  // if (error || !jogosProximos || jogosProximos.length === 0) {
  //   return NextResponse.json({ 
  //     message: "Nenhum jogo ao vivo ou próximo de começar. Requisição externa poupada." 
  //   });
  // }

  // Se chegou aqui, é porque tem jogo AO VIVO ou que começa nas próximas 2 horas, então vamos buscar os dados atualizados na API de Futebol
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  // Usando 'WC' para Copa do Mundo ou 'PL' para testes
  const API_URL = 'https://api.football-data.org/v4/competitions/BSA/matches'; //mudar para 'WC' na url da API quando for época de Copa do Mundo, ou usar 'BSA' para testes com o Brasileirão
 
  if (!API_KEY) {
    return NextResponse.json({ error: "API Key não configurada" }, { status: 500 });
  }

  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 0 } 
    });

    const data = await response.json();
    if (data.matches) {
  const jogosAoVivo = data.matches.filter((m: FootballMatch) => m.status === 'IN_PLAY');
  
  console.log("=== PROPRIEDADES DE TEMPO DOS JOGOS AO VIVO ===");
  jogosAoVivo.forEach((match: FootballMatch) => {
    console.log(`\n⚽ ${match.homeTeam.name} x ${match.awayTeam.name}:`);
    console.log(`- Status na API: ${match.status}`);
    
    // Inspeciona chaves comuns onde a API injeta o minuto do jogo
    console.log(`- Propriedade 'minute' direta:`, match.minute);
    console.log(`- Propriedade 'time' direta:`, match.time);
    
    // Alimenta uma visualização completa do objeto 'score' para ver se está lá dentro
    console.log(`- Objeto 'score' completo:`, JSON.stringify(match.score, null, 2));
  });
  console.log("\n===============================================");
}

    if (!data.matches) {
      return NextResponse.json({ error: "Dados não encontrados na API" }, { status: 404 });
    }

    // Mapeamento tipado para o seu banco de dados
    const matchesToUpsert = data.matches.map((match: FootballMatch) => {
      // Define o status dinamicamente baseado na API de Futebol
      let status: 'scheduled' | 'live' | 'finished' = 'scheduled';
      
      if (match.status === 'IN_PLAY' || match.status === 'PAUSED') {
        status = 'live';
      } else if (match.status === 'FINISHED') {
        status = 'finished';
      }

      let statusExibicao = 'Ainda não começou';
  
      if (match.status === 'SCHEDULED') {
        statusExibicao = 'Ainda não começou';
      } else if (match.status === 'PAUSED') {
        statusExibicao = 'Intervalo';
      } else if (match.status === 'FINISHED') {
        statusExibicao = 'Encerrado';
      } else if (match.status === 'IN_PLAY') {
        // Checa se o primeiro tempo já terminou olhando os dados do halfTime
        const jaTeveIntervalo = match.score?.halfTime?.home !== null && match.score?.halfTime?.away !== null;
        statusExibicao = jaTeveIntervalo ? '2º Tempo' : '1º Tempo';
      }

      return {
          team_home: match.homeTeam.name,
          team_away: match.awayTeam.name,
          date_time: match.utcDate,
          status: status,
          // Garante que o placar seja atualizado em tempo real no banco
          status_exibicao: statusExibicao,
          goals_home: match.score.fullTime.home,
          goals_away: match.score.fullTime.away,
          phase: match.stage ? match.stage.toLowerCase() : 'groups',
          group_letter: match.group ? match.group.replace('GROUP_', '') : null
        };
    }).filter((match: TransformedMatch) => match.team_home !== null && match.team_away !== null);
    // Upsert para salvar/atualizar
    const { error } = await supabase
      .from('matches')
      .upsert(matchesToUpsert, { 
        onConflict: 'team_home, team_away, date_time' 
      });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      count: matchesToUpsert.length 
    });

  } catch (err: unknown) {
    console.error("ERRO DETALHADO:", err); // Isso vai aparecer no seu terminal do VS Code
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const errorStack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ 
        success: false, 
        error: errorMessage,
        stack: errorStack 
    }, { status: 500 });
    }
}