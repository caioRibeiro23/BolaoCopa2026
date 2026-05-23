import { getChampionshipLeaderboard } from "@/src/lib/supabase/leaderboard";
import ChampionshipRow from "../ChampionshipTable/championshipRow";
import { createClient } from "@/src/lib/supabase/server";

const CHAMPIONSHIP_ID = "9f949a87-0b94-48ee-ae3d-aa65bd3478da";

export default async function FullChampionshipTable({
  userId,
}: {
  userId: string;
}) {
  const supabase = await createClient();

  // 🔐 1. VERIFICA PARTICIPAÇÃO
  const { data: participant } = await supabase
    .from("championship_participants")
    .select("id")
    .eq("championship_id", CHAMPIONSHIP_ID)
    .eq("user_id", userId)
    .single();

  // 🚫 2. BLOQUEIA ACESSO
  if (!participant) {
    return (
      <div className="bg-azulMedio border border-azulCinzado rounded-2xl p-6 text-center">
        <p className="text-cinzaSuave text-sm">
          Você não está participando deste campeonato.
        </p>
      </div>
    );
  }

  // ✅ 3. BUSCA RANKING (SÓ SE PARTICIPA)
  const players =
    (await getChampionshipLeaderboard(CHAMPIONSHIP_ID)) || [];

  return (
    <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">

      {/* HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white/5">
        <h2 className="text-[#FFD700] font-bebas-neue text-xl">
          🏆 Campeonato Completo
        </h2>

        <span className="text-xs text-cinzaSuave">
          {players.length} jogadores
        </span>
      </div>

      {/* ROWS */}
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
    </div>
  );
}