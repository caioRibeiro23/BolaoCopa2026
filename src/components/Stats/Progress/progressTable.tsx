import ProgressBar from "./progressBar"

export default function ProgressTable() {
    const totalMatches = 18
    const progressItems = [
        {
            label: "Placares Exatos",
            value: 7,
            gradientFrom: "#39FF14",
            gradientTo: "#00E0FF"
        },
        {
            label: "Resultados Certos",
            value: 12,
            gradientFrom: "#FFD700",
            gradientTo: "#FF8C00"
        },
        {
            label: "Sem Palpites",
            value: 3,
            gradientFrom: "#A3B1C6",
            gradientTo: "#7A8CA8"
        }
    ]

    return(
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <h2 className="text-[#E8EDF5] font-bebas-neue text-xl"> Meu Progresso</h2>
            </div>
            <div className="flex flex-col gap-4 px-6 py-4 w-full">
                {progressItems.map((item) => {
                    const percentage = Math.round((item.value / totalMatches) * 100)

                    return (
                        <div key={item.label} className="flex flex-col gap-2 w-full">
                            <div className="flex items-center justify-between w-full font-inter text-xs">
                                <p className="text-cinzaSuave">{item.label}</p>
                                <span className="font-bold text-[#E8EDF5]">{item.value}/{totalMatches} ({percentage}%)</span>
                            </div>
                            <ProgressBar
                                percentage={percentage}
                                gradientFrom={item.gradientFrom}
                                gradientTo={item.gradientTo}
                            />
                        </div>
                    )
                })}
                    </div>
            <div className="grid w-full grid-cols-3 gap-3 px-5 py-1 bg-[#FFFFFF]/2">
                <div className="flex flex-col justify-center items-center p-4 gap-2 border-r border-cinzaSuave/10">
                    <span className="font-bebas-neue text-2xl text-verdeNeon">150</span>
                    <p className="font-inter text-xs text-cinzaSuave">Pontos Totais</p>
                </div>
                <div className="flex flex-col justify-center items-center p-4 gap-2 border-r border-cinzaSuave/10">
                    <span className="font-bebas-neue text-2xl text-[#FFD700]">7</span>
                    <p className="font-inter text-xs text-cinzaSuave">Placares Exatos</p>
                </div>
                <div className="flex flex-col justify-center items-center p-4 gap-2">
                    <span className="font-bebas-neue text-2xl text-[#E8EDF5]">#3</span>
                    <p className="font-inter text-xs text-cinzaSuave">Posição</p>
                </div>
            </div>
        </div> 
    )
}