import { createClient } from "@/src/lib/supabase/server";
import ProfileForm from "./ProfileForms/profileForms";

interface ProfileSectionProps {
  userId: string;
}

export default async function ProfileSection({ userId }: ProfileSectionProps) {
  const supabase = await createClient();

  // Faz a busca dos dados do perfil direto aqui dentro, idêntico ao ProgressTable
  const [profileResponse, statsResponse] = await Promise.all([
    supabase
      .from("profiles") // Altere para o nome real da sua tabela de usuários se for diferente
      .select("username, avatar_url")
      .eq("id", userId)
      .single(),
    
    supabase
      .from("user_stats")
      .select("total_points")
      .eq("user_id", userId)
      .single()
  ]);

  // Trata os dados nulos ou vazios com fallbacks padrão
  const profile = profileResponse.data || { username: "Jogador", avatar_url: "/copa.png" };
  const stats = statsResponse.data || { total_points: 0 };

  const userData = {
  id: userId,
  name: profile.username || profileResponse.data?.username, // ou o que você definiu
  pts: stats.total_points,
  avatarUrl: profileResponse.data?.avatar_url || "/copa.png" 
};

// SE os seus dados de perfil vêm do Auth igual à Server Action, mude para:
const { data: { user } } = await supabase.auth.getUser();
const userDataFromAuth = {
  id: userId,
  name: user?.user_metadata?.full_name || "Jogador",
  pts: stats.total_points,
  avatarUrl: user?.user_metadata?.avatar_url || "/copa.png" // Garanta que essa linha exista aqui!
};

return <ProfileForm initialData={userDataFromAuth} />;
}