import UserBox from "../../ui/userBox";

interface ChampionshipRowProps {
    position: number;
    name: string;
    shortName: string;
    exactScores: number;
    points: number;
}

export default function championshipRow({ position, name, shortName, exactScores, points }: ChampionshipRowProps) {
    let positionSymbol = "";
    const isTopThree = position <= 3;

    if(position === 1) {
        positionSymbol = "🥇";
    } else if(position === 2) {
        positionSymbol = "🥈";
    } else if(position === 3) {
        positionSymbol = "🥉";
    } else {
        positionSymbol = position.toString();
    }

    return(
        <div className="w-full flex px-5 py-2.5 gap-3 items-center border-b border-cinzaSuave/10">
            {/* No futuro fazer lógica para colocar as posições certinhas */}
            <span className={`w-8 shrink-0 text-center leading-none ${isTopThree ? "text-lg" : "font-roboto text-base font-semibold tabular-nums text-[#E8EDF5]"}`}>
                {positionSymbol}
            </span>
            <UserBox name={shortName}/>
            <div className="w-full flex flex-col py-0.5">
                <p className="font-roboto text-sm text-[#E8EDF5]">{name}</p>
                <p className="font-inter text-[11px] text-cinzaSuave">{exactScores} exacts scores</p>
            </div>
            <div className="flex flex-col">
                <span className={ position == 1 ? `font-roboto text-base font-bold text-[#FFD700] drop-shadow-[0_0_8px_#FFD700]` : "font-roboto text-base font-bold text-[#E8EDF5]" }>{points}</span> 
                <p className="font-inter text-[10px] text-cinzaSuave">pts</p>
            </div>
        </div>
    )
}