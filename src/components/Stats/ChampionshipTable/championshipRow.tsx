import UserBox from "../../ui/userBox";

interface ChampionshipRowProps {
    position: number;
    name: string;
    shortName: string;
    exactScores: number;
    points: number;
    isCurrentUser?: boolean;
}

export default function championshipRow({ position, name, shortName, exactScores, points, isCurrentUser }: ChampionshipRowProps) {
    const isTopThree = position <= 3;
    const medalSymbol = position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉";

    return (
        <div
            className={`w-full flex px-5 py-2.5 gap-3 items-center border-b border-cinzaSuave/10 transition-all ${isCurrentUser
                    ? "bg-azulClaro/20 border border-azulClaroSuave/30 rounded-lg"
                    : ""
                }`}
        >
            {/* No futuro fazer lógica para colocar as posições certinhas */}
            <span className={`w-8 shrink-0 text-center leading-none ${isTopThree ? "text-lg" : "font-roboto text-base font-semibold tabular-nums text-[#E8EDF5]"}`}>
                {isTopThree ? medalSymbol : position}
            </span>
            <UserBox shortName={shortName} />
            <div className="w-full flex flex-col py-0.5">
                <p className="font-roboto text-sm text-[#E8EDF5] flex items-center gap-2">
                    {name}
                    {isCurrentUser && (
                        <span className="text-verdeNeon text-[10px] font-semibold">(Você)</span>
                    )}
                </p>
                <p className="font-inter text-[11px] text-cinzaSuave">{exactScores} exacts scores</p>
            </div>
            <div className="flex flex-col">
                <span className={position == 1 ? `font-roboto text-base font-bold text-[#FFD700] drop-shadow-[0_0_8px_#FFD700]` : "font-roboto text-base font-bold text-[#E8EDF5]"}>{points}</span>
                <p className="font-inter text-[10px] text-cinzaSuave">pts</p>
            </div>
        </div>
    )
}