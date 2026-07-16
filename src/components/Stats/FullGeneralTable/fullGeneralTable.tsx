import { getLeaderboard } from "@/src/lib/supabase/leaderboard";
import GeneralRow from "../GeneralTable/generalRow";

export default async function FullGeneralTable({
  userId,
}: {
  userId: string;
}) {
  const players = await getLeaderboard();

  return (
    <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">

      <div className="w-full flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white/5">
        <h2 className="text-[#FFD700] font-bebas-neue text-xl">
          🏆 Tabela Geral Completa
        </h2>

        <span className="text-xs text-cinzaSuave">
          {players.length} jogadores
        </span>
      </div>

      {players.map((player) =>
        player.total_points !== 0 && player.total_points !== null ? (
          <GeneralRow
            key={player.user_id}
            userId={player.user_id}
            position={player.position}
            name={player.full_name}
            shortName={(player.username || "US")
              .slice(0, 2)
              .toUpperCase()}
            exactScores={player.exact_scores}
            points={player.total_points}
            isCurrentUser={player.user_id === userId}
          />
        ) : null
      )}
    </div>
  );
}