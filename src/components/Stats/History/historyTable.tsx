import Link from "next/link";
import HistoryRow from "./historyRow";
import { createClient } from "@/src/lib/supabase/client";

interface HistoryTableProps {
    userId: string;
}

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

export default async function historyTable({ userId }: HistoryTableProps) {
    const supabase = createClient();

    //Data de início
    const dataLimiteISO = new Date (2026, 4, 22, 0, 0, 0, 0).toISOString();

    const { data: matchesData, error } = await supabase
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
        .eq("bets.user_id", userId) 
        .eq("status", "finished")
        .gt("date_time", dataLimiteISO)
        .order("date_time", { ascending: false })
        .limit(5); // Limita para os 5 jogos mais recentes após o dia 22
    if (error) {
        console.error("Erro ao carregar histórico:", error.message);
    }

    const matches: MatchWithBet[] = matchesData || [];
    const totalPartidas = matches.length;

    return(
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
            <div className="flex justify-center items-center px-5 py-4 bg-[#FFFFFF]/2">
                <Link href={`/stats/history?userId=${userId}`} className="text-cinzaSuave hover:underline text-sm font-inter">
                    Ver todos os palpites e resultados
                </Link>
            </div>
        </div>
    )
}