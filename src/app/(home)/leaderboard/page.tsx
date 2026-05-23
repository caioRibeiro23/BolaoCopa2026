import FullChampionshipTable from "@/src/components/Stats/FullChampionshipTable/fullChampionshipTable";
import FullGeneralTable from "@/src/components/Stats/FullGeneralTable/fullGeneralTable";
import TitlePage from "@/src/components/ui/titlepage";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClassificationPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="w-full px-8 py-16 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
      <TitlePage title="Classificação Completa" />
      <FullChampionshipTable userId={user.id} />
      <FullGeneralTable userId={user.id} />
    </div>
  );
}