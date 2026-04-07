import HistoryResultCard from "../../ui/historyResultCard";

interface HistoryRowProps {
    status: "exato" | "resultado" | "errado" | "nulo";
}

export default function historyRow({ status }: HistoryRowProps) {
    return(
        <div className="w-full grid grid-cols-[minmax(0,1fr)_6rem_7rem] px-5 py-2.5 gap-4 items-center">
            <div className="min-w-0 flex flex-col py-0.5 font-inter">
                <p className="font-bold text-sm text-[#E8EDF5]">Brasil vs Argentina</p>
                <span className="text-xs text-cinzaSuave">Grupo D - 13 jul</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 w-full gap-1">
                <p className="font-inter text-xs text-cinzaSuave">Seu palpite</p>
                <span className="font-bold text-base text-[#E8EDF5]">2 : 1</span>
                <p className="font-inter text-xs text-cinzaSuave">Final: 2 : 1</p>
            </div>
            <div className="w-full self-stretch flex justify-center items-center">
                <HistoryResultCard status={status} />
            </div>
        </div>
    )
}