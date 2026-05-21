import Link from "next/link";
import ChampionshipRow from "./championshipRow";
import { getLeaderboard } from "@/src/lib/supabase/leaderboard";

export default async function championshipTable() {
    const players = await getLeaderboard();

    return (
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <div className="text-[#FFD700] font-bebas-neue text-xl flex items-center gap-2">
                    <span>🏆</span>
                    <h2 className="drop-shadow-[0_0_8px_#FFD700]"> A Tabela</h2>
                </div>
                <span className="font-inter text-xs text-cinzaSuave">{players.length} jogadores</span>
            </div>
            {players.map((player) => (
                <ChampionshipRow
                    key={player.user_id}
                    position={player.position}
                    name={player.full_name}
                    shortName={player.username.slice(0, 2).toUpperCase()}
                    exactScores={player.exact_scores}
                    points={player.total_points}
                />
            ))}
            <div className="flex justify-center items-center px-5 py-4 bg-[#FFFFFF]/2">
                <Link href="/stats/classification" className="text-cinzaSuave hover:underline text-sm font-inter">
                    Mostrar tabela completa
                </Link>
            </div>
        </div>
    )
}