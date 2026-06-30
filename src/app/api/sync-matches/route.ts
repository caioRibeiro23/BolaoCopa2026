import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

interface FootballMatch {
  homeTeam: { name: string };
  awayTeam: { name: string };
  utcDate: string;
  status: string;
  minute?: number | string;
  time?: string;
 score: { 
    extraTime?: { home: number | null; away: number | null } | null;
    duration: string; // 🎯 Adicionado para validar a checagem de PENALTY_SHOOTOUT
    fullTime: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null } | null;
    regularTime?: { home: number | null; away: number | null } | null;
    penalties?: { home: number | null; away: number | null } | null; // 🎯 Adicionado para mapear as penalidades
  };
  stage?: string;
  group?: string;
}

interface FootballMatchApiResponse {
  homeTeam?: { name?: string };
  awayTeam?: { name?: string };
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

  //bloco de verificação para poupar a API de chamadas desnecessárias
  const agora = new Date();
  const duasHorasDepois = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

  // 2. Busca no banco se há jogos AO VIVO ou que começam nas próximas 2 horas
  const { data: jogosProximos, error } = await supabase
    .from('matches')
    .select('id, status, date_time, team_home, team_away')
    .or(`status.eq.live,and(status.eq.scheduled,date_time.lte.${duasHorasDepois.toISOString()})`);

  // 3. Se o banco estiver baleado ou se realmente não tiver jogo perto, poupa a API
  if (error || !jogosProximos || jogosProximos.length === 0) {
    return NextResponse.json({ 
      message: "Nenhum jogo ao vivo ou próximo de começar. Requisição externa poupada." 
    });
  }

  // Se chegou aqui, é porque tem jogo AO VIVO ou que começa nas próximas 2 horas, então vamos buscar os dados atualizados na API de Futebol
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  // Usando 'WC' para Copa do Mundo ou 'PL' para testes
  const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches'; //mudar para 'WC' na url da API quando for época de Copa do Mundo, ou usar 'BSA' para testes com o Brasileirão
 
  if (!API_KEY) {
    return NextResponse.json({ error: "API Key não configurada" }, { status: 500 });
  }

  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 0 } 
    });

    const data = await response.json();
    
    if (!data.matches) {
      return NextResponse.json({ error: "Dados não encontrados na API" }, { status: 404 });
    }

    console.log("\n==============================================");
    console.log("🔍 INSPEÇÃO GERAL DA API: BUSCANDO SENEGAL X BÉLGICA");
    console.log("==============================================");
    console.log(`Total de jogos retornados pela API: ${data.matches.length}`);
    
    // Vamos listar todos os jogos para você ver o que tem no payload
    data.matches.forEach((match: FootballMatch, index: number) => {
      const isTargetMatch = 
        match.homeTeam.name === 'Senegal' || match.awayTeam.name === 'Senegal' ||
        match.homeTeam.name === 'Belgium' || match.awayTeam.name === 'Belgium';

      // Destaca se encontrar qualquer menção a Senegal ou Bélgica
      if (isTargetMatch) {
        console.log(`\n🚨 [ENCONTRADO] Jogo #${index + 1}:`);
      } else {
        console.log(`\n📅 Jogo #${index + 1}:`);
      }
      
      console.log(`   Confronto : ${match.homeTeam.name} x ${match.awayTeam.name}`);
      console.log(`   Status    : ${match.status}`);
      console.log(`   Data UTC  : ${match.utcDate}`);
      console.log(`   Fase      : ${match.stage}`);
      console.log(`   ---------------------------------------------`);
    });
    console.log("==============================================\n");

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
      } else if (match.status === 'FINISHED') {
        statusExibicao = 'Encerrado';
      } else if (match.status === 'PAUSED') {
        // 🎯 Se estiver pausado mas a API já identificou que o destino é a prorrogação/pênaltis,
        // exibe o status correto em vez de "Intervalo"
        if (match.score?.duration === 'EXTRA_TIME') {
          statusExibicao = 'Prorrogação';
        } else if (match.score?.duration === 'PENALTY_SHOOTOUT') {
          statusExibicao = 'Pênaltis';
        } else {
          statusExibicao = 'Intervalo'; // Intervalo normal dos 45 min
        }
      } else if (match.status === 'IN_PLAY') {
        if (match.score?.duration === 'EXTRA_TIME') {
          statusExibicao = 'Prorrogação';
        } else if (match.score?.duration === 'PENALTY_SHOOTOUT') {
          statusExibicao = 'Pênaltis';
        } else {
          // Checa se o primeiro tempo já terminou olhando os dados do halfTime
          const jaTeveIntervalo = match.score?.halfTime?.home !== null && match.score?.halfTime?.away !== null;
          statusExibicao = jaTeveIntervalo ? '2º Tempo' : '1º Tempo';
        }
      }
      // 1. Pegamos os gols dos 90 minutos regulamentares
      // Se o regularTime ainda não existir (jogo no início), usamos o fullTime como fallback
      const gols90Home = match.score.regularTime?.home ?? match.score.fullTime.home ?? 0;
      const gols90Away = match.score.regularTime?.away ?? match.score.fullTime.away ?? 0;

      // 2. Pegamos os gols marcados estritamente na prorrogação (se houver)
      const golsProrrogacaoHome = match.score.extraTime?.home ?? 0;
      const golsProrrogacaoAway = match.score.extraTime?.away ?? 0;

      // 3. O placar final do seu bolão (bola rolando) será a soma dos dois, 
      // ficando totalmente imune aos pênaltis e aos bugs de fim de jogo da API
      const goals_home_final = gols90Home + golsProrrogacaoHome;
      const goals_away_final = gols90Away + golsProrrogacaoAway;

      return {
          team_home: match.homeTeam.name,
          team_away: match.awayTeam.name,
          date_time: match.utcDate,
          status: status,
          // Garante que o placar seja atualizado em tempo real no banco
          status_exibicao: statusExibicao,
          goals_home: goals_home_final,
          goals_away: goals_away_final,
          phase: match.stage ? match.stage.toLowerCase() : 'groups',
          group_letter: match.group ? match.group.replace('GROUP_', '') : null
        };
    }).filter((match: TransformedMatch) => {
    // 🎯 SE O STATUS FOR FINISHED, NÃO ATUALIZA (IGNORA O UPSERT)
   const correspondenteNoBanco = jogosProximos.find(
        j => j.team_home === match.team_home && j.team_away === match.team_away
      );

      // Se o jogo NÃO foi encontrado na lista de ativos (ou seja, já está como 'finished' no seu banco), barra!
      // Isso protege o 4x0 da Espanha de ser sobrescrito pelo 5x0.
      if (!correspondenteNoBanco && match.status === 'finished') {
        return false;
      }
    
    return match.team_home !== null && match.team_away !== null;
    });
    // Upsert para salvar/atualizar
    const { error } = await supabase
      .from('matches')
      .upsert(matchesToUpsert, { 
        onConflict: 'team_home, team_away, date_time' 
      });

    if (error) throw error;
    
    revalidatePath("/");

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
