interface HistoryResultCardProps {
   status: "exato" | "resultado" | "errado" | "nulo" | "combo" | "um_gol" | "incorreto";
}

const statusStyles: Record<
    HistoryResultCardProps["status"], 
    { label: string; points: string; colorClass: string; bgClass: string; borderClass: string; }
> = {
    exato: {
        label: "Exato",
        points: "+9 pts",
        colorClass: "text-verdeNeon",
        bgClass: "bg-verdeNeon/8",
        borderClass: "border-verdeNeon/20",
    },
    combo: {
        label: "Combo",
        points: "+5 pts",
        colorClass: "text-cyan-400",               // 🎨 Copiado do cardConfig.combo (Home)
        bgClass: "bg-cyan-500/10",                 // 🎨 Copiado do cardConfig.combo (Home)
        borderClass: "border-cyan-500/20",         // 🎨 Copiado do cardConfig.combo (Home)
    },
    resultado: {
        label: "Resultado",
        points: "+3 pts",
        colorClass: "text-[#FFD700]",
        bgClass: "bg-[#FFD700]/10",
        borderClass: "border-[#FFD700]/25",
    },
    um_gol: {
        label: "Um dos Gols",
        points: "+1 pt",
        colorClass: "text-orange-400",             // 🎨 Copiado do cardConfig.um_gol (Home)
        bgClass: "bg-orange-500/10",               // 🎨 Copiado do cardConfig.um_gol (Home)
        borderClass: "border-orange-500/20",       // 🎨 Copiado do cardConfig.um_gol (Home)
    },
    incorreto: {
        label: "Incorreto",
        points: "+0 pts",
        colorClass: "text-vermelhoVibrante",
        bgClass: "bg-vermelhoVibrante/8",
        borderClass: "border-vermelhoVibrante/20",
    },
    // Mapeamento de compatibilidade estrutural
    errado: {
        label: "Incorreto",
        points: "+0 pts",
        colorClass: "text-vermelhoVibrante",
        bgClass: "bg-vermelhoVibrante/8",
        borderClass: "border-vermelhoVibrante/20",
    },
    nulo: {
        label: "Sem Palpite",
        points: "+0 pts",
        colorClass: "text-cinzaSuave",
        bgClass: "bg-cinzaSuave/5",
        borderClass: "border-cinzaSuave/20",
    }
};

export default function HistoryResultCard({ status }: HistoryResultCardProps) {
    const style = statusStyles[status];

    return (
        <div className="flex flex-col items-center md:items-end justify-center gap-0.5 md:gap-2 w-full">
            <div className={`w-fit min-w-18 md:w-full text-center px-2 md:px-3 py-1 rounded-lg border shadow-md font-inter text-[10px] md:text-xs tracking-[0.5px] md:tracking-[1px] ${style.colorClass} ${style.bgClass} ${style.borderClass}`}>
                {style.label}
            </div>
            <span className={`hidden md:block w-full text-center font-inter text-xs font-bold ${style.colorClass}`}>{style.points}</span>
        </div>
    );
}