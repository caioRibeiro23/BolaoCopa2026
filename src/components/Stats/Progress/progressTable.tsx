import { createClient } from "@/src/lib/supabase/client";
import ProgressBar from "./progressBar"

const supabase = createClient();

interface ProgressTableProps {
  userId: string; 
}

interface StatRecord {
    total_points: number;
    exact_scores: number;
    correct_results: number;
    total_bets: number;
}

interface LeaderboardEntry {
    user_id: string;
}

interface ProgressItem {
    label: string;
    value: number;
    gradientFrom: string;
    gradientTo: string;
}


export default async function ProgressTable({ userId }: ProgressTableProps) {
    const [statsResponse, matchesResponse, rankingResponse]: [
        { data: StatRecord | null },
        { count: number | null },
        { data: LeaderboardEntry[] | null }
    ] = await Promise.all([
    // Busca os dados acumulados do usuário específico
        supabase
            .from("user_stats")
            .select("total_points, exact_scores, correct_results, total_bets")
            .eq("user_id", userId)
            .single(),

        // Busca a contagem total de partidas do Brasileirão cadastradas
        supabase
            .from("matches")
            .select("id", { count: "exact", head: true })
            .eq("status", "finished"),
        

        // Busca o ranking ordenado para descobrir a posição real dele
        supabase
            .from("leaderboard")
            .select("user_id")
            ]);

    const stats: StatRecord = statsResponse.data || { total_points: 0, exact_scores: 0, correct_results: 0, total_bets: 0 };
    const totalMatches = matchesResponse.count || 0;

    const leaderboardIds: LeaderboardEntry[] = rankingResponse.data || [];
    const userPositionIndex: number = leaderboardIds.findIndex((player: LeaderboardEntry) => player.user_id === userId);
    const currentPosition = userPositionIndex !== -1 ? userPositionIndex + 1 : "-";

    const missedBets = Math.max(0, totalMatches - stats.total_bets);
    const progressItems: ProgressItem[] = [
        {
            label: "Placares Exatos",
            value: stats.exact_scores,
            gradientFrom: "#39FF14",
            gradientTo: "#00E0FF"
        },
        {
            label: "Resultados Certos",
            value: stats.correct_results,
            gradientFrom: "#FFD700",
            gradientTo: "#FF8C00"
        },
        {
            label: "Sem Palpites",
            value: missedBets,
            gradientFrom: "#A3B1C6",
            gradientTo: "#7A8CA8"
        }
    ]

    return(
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <h2 className="text-[#E8EDF5] font-bebas-neue text-xl"> Meu Progresso</h2>
            </div>
            <div className="flex flex-col gap-4 px-6 py-4 w-full">
                {progressItems.map((item) => {
                    const percentage = Math.round((item.value / totalMatches) * 100)

                    return (
                        <div key={item.label} className="flex flex-col gap-2 w-full">
                            <div className="flex items-center justify-between w-full font-inter text-xs">
                                <p className="text-cinzaSuave">{item.label}</p>
                                <span className="font-bold text-[#E8EDF5]">{item.value}/{totalMatches} ({percentage}%)</span>
                            </div>
                            <ProgressBar
                                percentage={percentage}
                                gradientFrom={item.gradientFrom}
                                gradientTo={item.gradientTo}
                            />
                        </div>
                    )
                })}
                    </div>
            <div className="grid w-full grid-cols-3 gap-3 px-5 py-1 bg-[#FFFFFF]/2">
                <div className="flex flex-col justify-center items-center p-4 gap-2 border-r border-cinzaSuave/10">
                    <span className="font-bebas-neue text-2xl text-verdeNeon">{stats.total_points}</span>
                    <p className="font-inter text-xs text-cinzaSuave text-center">Pontos Totais</p>
                </div>
                <div className="flex flex-col justify-center items-center p-4 gap-2 border-r border-cinzaSuave/10">
                    <span className="font-bebas-neue text-2xl text-[#FFD700]">{stats.exact_scores}</span>
                    <p className="font-inter text-xs text-cinzaSuave text-center">Placares Exatos</p>
                </div>
                <div className="flex flex-col justify-center items-center p-4 gap-2">
                    <span className="font-bebas-neue text-2xl text-[#E8EDF5]">{currentPosition}</span>
                    <p className="font-inter text-xs text-cinzaSuave text-center">Posição</p>
                </div>
            </div>
        </div> 
    )
}