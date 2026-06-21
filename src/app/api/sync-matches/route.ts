import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

interface FootballMatch {
  homeTeam: { name: string };
  awayTeam: { name: string };
  utcDate: string;
  status: string;
  score: Record<string, Record<string, number | null> | null | undefined>;
  stage?: string;
  group?: string;
}

// Inicializa o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const agora = new Date();
  const duasHorasDepois = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

  // Busca se há jogos próximos apenas para passar pela validação inicial
  const { data: jogosProximos, error } = await supabase
    .from('matches')
    .select('id, status, date_time')
    .or(`status.eq.live,and(status.eq.scheduled,date_time.lte.${duasHorasDepois.toISOString()})`);

  if (error || !jogosProximos || jogosProximos.length === 0) {
    return NextResponse.json({ 
      message: "Nenhum jogo ao vivo ou próximo de começar. Requisição externa poupada." 
    });
  }

  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
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

    console.log("\n==============================================");
    console.log("🔍 INSPEÇÃO FILTRADA: APENAS JOGOS JÁ INICIADOS/ENCERRADOS");
    console.log("==============================================");
    
    data.matches.forEach((match: FootballMatch) => {
      // FILTRO: Só deixa passar o que estiver ao vivo, no intervalo ou finalizado pela API gringa
      if (match.status === 'IN_PLAY' || match.status === 'PAUSED' || match.status === 'FINISHED') {
        console.log(`\n⚽ JOGO: ${match.homeTeam.name} x ${match.awayTeam.name}`);
        console.log(`   ⏱️ Status API: ${match.status}`);
        console.log(`   📊 Objeto 'score' completo:`);
        console.log(JSON.stringify(match.score, null, 2));
        console.log(`   ---------------------------------------------`);
      }
    });

    console.log("\n==============================================");

    return NextResponse.json({ 
      success: true, 
      message: "Dados dos jogos iniciados impressos no terminal do VS Code.",
      count: data.matches.length 
    });

  } catch (err: unknown) {
    console.error("ERRO DETALHADO:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}