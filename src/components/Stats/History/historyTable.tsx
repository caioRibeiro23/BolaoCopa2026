import Link from "next/link";
import HistoryRow from "./historyRow";

export default function historyTable() {
    return(
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <h2 className="text-[#E8EDF5] font-bebas-neue text-xl"> Histórico de Partidas</h2>
                <span className="font-inter text-xs text-cinzaSuave">18 partidas</span>
            </div>
            <HistoryRow status="exato"/>
            <HistoryRow status="resultado"/>
            <HistoryRow status="errado"/>
            <HistoryRow status="nulo"/>
            <div className="flex justify-center items-center px-5 py-4 bg-[#FFFFFF]/2">
                <Link href="/stats/history" className="text-cinzaSuave hover:underline text-sm font-inter">
                    Ver todos os palpites e resultados
                </Link>
            </div>
        </div>
    )
}