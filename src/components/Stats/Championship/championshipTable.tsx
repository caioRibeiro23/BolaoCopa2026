import Link from "next/link";
import ChampionshipRow from "./championshipRow";

export default function championshipTable() {
    return(
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <div className="text-[#FFD700] font-bebas-neue text-xl flex items-center gap-2">
                    <span>🏆</span>
                    <h2 className="drop-shadow-[0_0_8px_#FFD700]"> A Tabela</h2>
                </div>
                <span className="font-inter text-xs text-cinzaSuave">18 partidas - Fase de Grupos</span>
            </div>
            <ChampionshipRow 
                position={1} 
                name="Marco K." 
                shortName="MK" 
                exactScores={9} 
                points={218} 
            />
            <div className="flex justify-center items-center px-5 py-4 bg-[#FFFFFF]/2">
                <Link href="/stats/classification" className="text-cinzaSuave hover:underline text-sm font-inter">
                    Mostrar tabela completa
                </Link>
            </div>
        </div>
    )
}