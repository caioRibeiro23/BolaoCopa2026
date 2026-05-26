import Link from "next/link";
import { getChampionshipLeaderboard } from "@/src/lib/supabase/leaderboard";
import ChampionshipRow from "./championshipRow";

export default async function ChampionshipTable({
  userId,
}: {
  userId: string;
}) {
    const players = await getChampionshipLeaderboard(
        "9f949a87-0b94-48ee-ae3d-aa65bd3478da"
    );

    return (
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2">
                <div className="text-[#FFD700] font-bebas-neue text-xl flex items-center gap-2">
                    <span>🏆</span>

                    <h2 className="drop-shadow-[0_0_8px_#FFD700]">
                        A Tabela do Campeonato
                    </h2>
                </div>

                <span className="font-inter text-xs text-cinzaSuave">
                    {players.length} jogadores
                </span>
            </div>

            {players.map((player) => (
                <ChampionshipRow
                    key={player.user_id}
                    position={player.position}
                    name={player.full_name}
                    shortName={(player.username || "US")
                        .slice(0, 2)
                        .toUpperCase()}
                    exactScores={player.exact_scores}
                    points={player.total_points}
                    isCurrentUser={player.user_id === userId}
                />
            ))}

            <div className="flex justify-center items-center px-5 py-4 bg-[#FFFFFF]/2">
                <Link
                    href="/tournament"
                    className="text-cinzaSuave hover:underline text-sm font-inter"
                >
                    Mostrar tabela completa
                </Link>
            </div>
        </div>
    );
}