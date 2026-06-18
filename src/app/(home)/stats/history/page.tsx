import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import HistoryRow from "@/src/components/Stats/History/historyRow";
import TitlePage from "@/src/components/ui/titlepage";
import { redirect } from "next/navigation";

interface MatchWithBet {
    id: string;
    team_home: string;
    team_away: string;
    goals_home: number;
    goals_away: number;
    utc_date: string;
    group_letter: string | null;
    bets: {
        prediction_home: number;
        prediction_away: number;
        points_earned: number;
    }[];
}

export type StatusLinhaHistorico = "exato" | "combo" | "resultado" | "um_gol" | "incorreto" | "nulo";

export default async function historyPage() {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    const dataLimiteISO = new Date(2026, 4, 22, 0, 0, 0, 0).toISOString();

    const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(`
            id,
            team_home,
            team_away,
            goals_home,
            goals_away,
            date_time,
            bets!left (
                prediction_home,
                prediction_away,
                points_earned
            )
        `)
        .eq("bets.user_id", user.id)
        .eq("status", "finished")
        .gt("date_time", dataLimiteISO)
        .order("date_time", { ascending: false });

    if (matchesError) {
        console.error("Erro ao carregar histórico:", matchesError.message);
    }

    const matches: MatchWithBet[] = (matchesData || []).map((match) => ({
        id: match.id,
        team_home: match.team_home,
        team_away: match.team_away,
        goals_home: match.goals_home,
        goals_away: match.goals_away,
        utc_date: match.date_time,
        group_letter: null,
        bets: match.bets,
    }));
    const totalPartidas = matches.length;

    return(
        <div className="w-full min-h-screen px-8 py-16 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
            {/* Botão Voltar Minimalista */}
            <div className="flex items-center">
              <Link
                href="/stats"
                className="flex items-center gap-2 text-xs font-inter uppercase tracking-wider text-cinzaSuave/60 hover:text-verdeNeon transition-colors duration-200 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Voltar
              </Link>
            </div>

            <TitlePage title="Classificação Completa" />
            <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
                <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                    <h2 className="text-[#E8EDF5] font-bebas-neue text-xl"> Histórico de Partidas</h2>
                    <span className="font-inter text-xs text-cinzaSuave">{totalPartidas} {totalPartidas === 1 ? "partida" : "partidas"}</span>
                </div>
                {matches.map((jogo) => {
                    const palpite = jogo.bets && jogo.bets.length > 0 ? jogo.bets[0] : null;

                    // 1️⃣ Inicializa como nulo caso o usuário não tenha dado palpite
                    let statusLinha: StatusLinhaHistorico = "nulo";

                    if (palpite) {
                        const placarCasa = jogo.goals_home;
                        const placarVisitante = jogo.goals_away;
                        const palpiteCasa = palpite.prediction_home;
                        const palpiteVisitante = palpite.prediction_away;

                        const acertouGolCasa = palpiteCasa === placarCasa;
                        const acertouGolVisitante = palpiteVisitante === placarVisitante;

                        const saldoPalpite = palpiteCasa - palpiteVisitante;
                        const saldoReal = placarCasa - placarVisitante;
                        const acertouVencedor = Math.sign(saldoPalpite) === Math.sign(saldoReal);

                        // 🧠 2️⃣ Espelhamento exato da Árvore de Decisão do seu Card da Home
                        if (acertouGolCasa && acertouGolVisitante) {
                            statusLinha = "exato";       // Acertou o placar em cheio (9 pts)
                        } else if (acertouVencedor && (acertouGolCasa || acertouGolVisitante)) {
                            statusLinha = "combo";       // Vencedor + gol de um dos times (5 pts)
                        } else if (acertouVencedor) {
                            statusLinha = "resultado";   // Acertou apenas a tendência/vencedor (3 pts)
                        } else if (acertouGolCasa || acertouGolVisitante) {
                            statusLinha = "um_gol";      // Errou o vencedor mas acertou o gol de um time (1 pt)
                        } else {
                            statusLinha = "incorreto";   // Errou tudo (0 pts)
                        }
                    }
                    return (
                        <HistoryRow 
                            key={jogo.id}
                            status={statusLinha}
                            match={jogo} // Passa os dados do jogo e do palpite para a linha gerenciar a exibição
                        />
                    );
                })}

                {/* Fallback caso não tenha nenhum jogo após o dia 22 */}
                {totalPartidas === 0 && (
                    <div className="text-center py-6 text-cinzaSuave font-inter text-sm">
                        Nenhum histórico de partida encontrado após o dia 22.
                    </div>
                )}
            </div>
        </div>
    )
}