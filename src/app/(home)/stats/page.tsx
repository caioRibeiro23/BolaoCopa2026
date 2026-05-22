import TitlePage from "@/src/components/ui/titlepage";
import ChampionshipTable from "@/src/components/Stats/ChampionshipTable/championshipTable";
import HistoryTable from "@/src/components/Stats/History/historyTable";
import ProgressTable from "@/src/components/Stats/Progress/progressTable";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import GeneralTable from "@/src/components/Stats/GeneralTable/generalTable";

export default async function StatsPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }
    return(
        <div className="w-full px-8 py-16 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
            <TitlePage title="Classificação e Progresso"/>
            <GeneralTable/>
            <ChampionshipTable/>
            <ProgressTable userId={user.id}/>
            <HistoryTable/>
        </div>
    )
}

