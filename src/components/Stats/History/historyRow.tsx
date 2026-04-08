import { getCountryAbbr } from "../../cards/iconePais/countryAbbr";
import HistoryResultCard from "../../ui/historyResultCard";

interface HistoryRowProps {
    status: "exato" | "resultado" | "errado" | "nulo";
}

export default function historyRow({ status }: HistoryRowProps) {
    return(
        <div className="w-full grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem] md:grid-cols-[minmax(0,1fr)_6rem_7rem] px-3 md:px-5 py-2.5 gap-2 md:gap-4 items-center border-b border-cinzaSuave/10">
            <div className="min-w-0 flex flex-col py-0.5 font-inter">
                <p className="font-bold text-sm text-[#E8EDF5] md:hidden">{getCountryAbbr("Brasil")} vs {getCountryAbbr("Argentina")}</p>
                <p className="font-bold text-sm text-[#E8EDF5] hidden md:flex">Brasil vs Argentina</p>
                <span className="text-xs text-cinzaSuave">Grupo D - 13 jul</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 w-full gap-0.5 md:gap-1">
                <p className="font-inter text-[10px] md:text-xs text-cinzaSuave">Seu palpite</p>
                <span className="font-bold text-sm md:text-base text-[#E8EDF5]">2 : 1</span>
                <p className="font-inter text-[10px] md:text-xs text-cinzaSuave">Final: 2 : 1</p>
            </div>
            <div className="w-full flex justify-center items-center">
                <HistoryResultCard status={status} />
            </div>
        </div>
    )
}