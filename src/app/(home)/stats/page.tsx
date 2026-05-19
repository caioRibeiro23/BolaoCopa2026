import TitlePage from "@/src/components/ui/titlepage";
import ChampionshipTable from "@/src/components/Stats/Championship/championshipTable";
import HistoryTable from "@/src/components/Stats/History/historyTable";
import ProgressTable from "@/src/components/Stats/Progress/progressTable";

export default function StatsPage() {
    return(
        <div className="w-full px-8 py-16 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
            <TitlePage title="Classificação e Progresso"/>
            <ChampionshipTable/>
            <ProgressTable/>
            <HistoryTable/>
        </div>
    )
}