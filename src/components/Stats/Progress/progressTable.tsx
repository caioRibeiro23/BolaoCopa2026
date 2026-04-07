export default function ProgressTable() {
    return(
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <h2 className="text-[#E8EDF5] font-bebas-neue text-xl"> Meu Progresso</h2>
            </div>
            <div className="grid w-full grid-cols-3 gap-3 px-5 py-4 bg-[#FFFFFF]/2">
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