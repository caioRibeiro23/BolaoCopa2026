import { createClient } from "./client";

// Inicializa o client do Supabase a partir das variáveis de ambiente
const supabase = createClient();

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

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
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