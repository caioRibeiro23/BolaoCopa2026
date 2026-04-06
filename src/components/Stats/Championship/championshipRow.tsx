import UserBox from "../../ui/userBox";

interface ChampionshipRowProps {
    position: number;
    name: string;
    shortName: string;
    exactScores: number;
    points: number;
}

export default function championshipRow({ position, name, shortName, exactScores, points }: ChampionshipRowProps) {
    return(
        <div className="w-full flex px-5 py-2.5 gap-3 items-center">
            {/* No futuro fazer lógica para colocar as posições certinhas */}
            <span className="text-lg">🥇</span>
            <UserBox name={shortName}/>
            <div className="w-full flex flex-col py-0.5">
                <p className="font-roboto text-sm text-[#E8EDF5]">{name}</p>
                <p className="font-inter text-[11px] text-cinzaSuave">{exactScores} exacts scores</p>
            </div>
            <div className="flex flex-col">
                <span className="font-roboto text-base font-bold text-[#FFD700] drop-shadow-[0_0_8px_#FFD700]">{points}</span> 
                <p className="font-inter text-[10px] text-cinzaSuave">pts</p>
            </div>
        </div>
    )
}