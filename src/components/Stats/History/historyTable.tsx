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
                
                // Lógica para definir o status visual da linha
                let statusLinha: "exato" | "resultado" | "errado" | "nulo" = "nulo";

                if (palpite) {
                    if (palpite.points_earned === 10) {
                        statusLinha = "exato";
                    } else if (palpite.points_earned === 5) {
                        statusLinha = "resultado";
                    } else if (palpite.points_earned === 0) {
                        statusLinha = "errado";
                    }
                } else {
                    statusLinha = "nulo"; // Jogo sem palpite
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
                <Link href="/stats/history" className="text-cinzaSuave hover:underline text-sm font-inter">
                    Ver todos os palpites e resultados
                </Link>
            </div>
        </div>
    )
}