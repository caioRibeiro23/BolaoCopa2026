import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

interface FootballMatch {
  homeTeam: { name: string };
  awayTeam: { name: string };
  utcDate: string;
  status: string;
  score: { fullTime: { home: number | null; away: number | null } };
  stage?: string;
  group?: string;
}

interface TransformedMatch {
  team_home: string;
  team_away: string;
  date_time: string;
  status: string;
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
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  // Usando 'WC' para Copa do Mundo ou 'PL' para testes
  const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches';

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

    // Mapeamento tipado para o seu banco de dados
    const matchesToUpsert = data.matches.map((match: FootballMatch) => ({
      team_home: match.homeTeam.name,
      team_away: match.awayTeam.name,
      date_time: match.utcDate,
      status: match.status === 'TIMED' ? 'scheduled' : 
              match.status === 'IN_PLAY' ? 'live' : 'finished',
      goals_home: match.score.fullTime.home ?? null,
      goals_away: match.score.fullTime.away ?? null,
      phase: match.stage ? match.stage.toLowerCase() : 'groups',
      group_letter: match.group ? match.group.replace('GROUP_', '') : null
    }))
    .filter((match: TransformedMatch) => match.team_home !== null && match.team_away !== null);

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