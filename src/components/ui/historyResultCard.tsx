interface HistoryResultCardProps {
    status: "exato" | "resultado" | "errado" | "nulo";
}

const statusStyles: Record<HistoryResultCardProps["status"], { label: string; points: string; colorClass: string; bgClass: string; borderClass: string; }> = {
    exato: {
        label: "Exato",
        points: "+3 pts",
        colorClass: "text-verdeNeon",
        bgClass: "bg-verdeNeon/8",
        borderClass: "border-verdeNeon/20",
    },
    resultado: {
        label: "Resultado",
        points: "+1 pt",
        colorClass: "text-[#FFD700]",
        bgClass: "bg-[#FFD700]/10",
        borderClass: "border-[#FFD700]/25",
    },
    errado: {
        label: "Errado",
        points: "+0 pts",
        colorClass: "text-vermelhoVibrante",
        bgClass: "bg-vermelhoVibrante/8",
        borderClass: "border-vermelhoVibrante/20",
    },
    nulo: {
        label: "Nulo",
        points: "+0 pts",
        colorClass: "text-cinzaSuave",
        bgClass: "bg-cinzaSuave/5",
        borderClass: "border-cinzaSuave/20",
    },
};

export default function HistoryResultCard({ status }: HistoryResultCardProps) {
    const style = statusStyles[status];

    return (
        <div className="flex flex-col items-end justify-center gap-2">
            <div className={`w-full text-center px-3 py-1.5 rounded-lg border shadow-md font-inter text-xs tracking-[1px] ${style.colorClass} ${style.bgClass} ${style.borderClass}`}>
                {style.label}
            </div>
            <span className={`w-full text-center font-inter text-xs font-bold ${style.colorClass}`}>{style.points}</span>
        </div>
    );
}