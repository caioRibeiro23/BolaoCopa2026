import { createClient } from "./server";

export interface LeaderboardUser {
  user_id: string;        // ID mapeado na View nova
  username: string;
  full_name: string;
  avatar_url: string | null;
  total_points: number;
  exact_scores: number;   // Nome exato da coluna na View nova
  correct_results: number;
  total_bets: number;
  position: number;       // Campo controlado que injetamos logo abaixo
}

interface ChampionshipLeaderboardUser {
  championship_id: string;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  total_points: number;
  exact_scores: number;
  correct_results: number;
  total_bets: number;
}

interface ChampionshipRow {
  id: string;
  name: string | null;
}

export interface UserChampionship {
  championship_id: string;
  championship_name: string;
  position: number;
  total_points: number;
}

export async function getLeaderboard(): Promise<LeaderboardUser[]> {

  const supabase = await createClient();

  // A requisição precisa selecionar as colunas que realmente existem na View nova
  const { data, error } = await supabase
    .from('leaderboard')
    .select('user_id, username, full_name, avatar_url, total_points, exact_scores, correct_results, total_bets');

  if (error) {
    // Mudamos para .message para você ver o erro real se algo der errado
    console.error("Erro detalhado do Supabase:", error.message); 
    return [];
  }

  // Como o banco já traz ordenado por pontos e desempates, injetamos a posição pelo index do array
  const playersWithPosition = (data || []).map((player: Omit<LeaderboardUser, 'position'>, index: number) => ({
    ...player,
    position: index + 1
  }));

  return playersWithPosition as LeaderboardUser[];
}


export async function getChampionshipLeaderboard(championshipId: string) {

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('championship_leaderboard')
    .select('*')
    .eq('championship_id', championshipId);

  if (error) {
    console.error(error);
    return [];
  }

  return ((data || []) as ChampionshipLeaderboardUser[])
  .map((player, index) => ({
    ...player,
    position: index + 1,
  }));
}

export async function getUserChampionships(
  userId: string
): Promise<UserChampionship[]> {
  if (!userId) {
    return [];
  }

  const supabase = await createClient();

  const { data: membershipData, error: membershipError } = await supabase
    .from("championship_leaderboard")
    .select("championship_id, total_points")
    .eq("user_id", userId)
    .order("total_points", { ascending: false });

  if (membershipError) {
    console.error(
      "Erro ao buscar campeonatos do usuario:",
      membershipError.message
    );

    return [];
  }

  const memberships = (membershipData || []).map((membership, index) => ({
    championship_id: membership.championship_id,
    total_points: membership.total_points,
    position: index + 1,
  }));

  if (memberships.length === 0) {
    return [];
  }

  const championshipIds = Array.from(
    new Set(memberships.map((membership) => membership.championship_id))
  );

  const championshipNames = new Map<string, string>();

  const { data: championshipData, error: championshipError } = await supabase
    .from("championships")
    .select("id, name")
    .in("id", championshipIds);

  if (championshipError) {
    console.error(
      "Erro ao buscar nomes dos campeonatos:",
      championshipError.message
    );
  } else {
    for (const championship of championshipData || []) {
      championshipNames.set(championship.id, championship.name || "");
    }
  }

  return memberships.map((membership, index) => ({
    championship_id: membership.championship_id,

    championship_name:
      championshipNames.get(membership.championship_id) ||
      `Torneio ${index + 1}`,

    position: membership.position,

    total_points: membership.total_points,
  }));
}