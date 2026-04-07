interface ResultCardProps {
    status: "exato" | "resultado" | "incorreto" | undefined;
}

export default function ResultCard({ status }: ResultCardProps) {
    return(
        status === undefined ? (
                <div className="w-full flex justify-center items-center pb-5">
                    <button className="px-4 py-2 bg-cinzaSuave/5 text-cinzaSuave rounded-lg font-normal font-inter text-xs bp-540:text-sm tracking-[1px] shadow-md border border-cinzaSuave/20" type="submit" disabled>
                        Sem Palpite <span className="font-bold">+0 pts</span>
                    </button>
                </div>
            ) :
        
        status === "exato" ? (
            <div className="w-full flex justify-center items-center pb-5">
                <button className="px-4 py-2 bg-verdeNeon/8 text-verdeNeon rounded-lg font-normal font-inter text-xs bp-540:text-sm tracking-[1px] shadow-md border border-verdeNeon/20" type="submit" disabled>
                    ✓ Placar Exato <span className="font-bold">+3 pts</span>
                </button>
            </div>
        ) : status === "resultado" ? (
            <div className="w-full flex justify-center items-center pb-5">
                <button className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg font-normal font-inter text-xs bp-540:text-sm tracking-[1px] shadow-md border border-[#FFD700]/25" type="submit" disabled>
                    ✓ Resultado Correto <span className="font-bold">+1 pt</span>
                </button>
            </div>
        ) : (
            <div className="w-full flex justify-center items-center pb-5">
                <button className="px-4 py-2 bg-vermelhoVibrante/8 text-vermelhoVibrante rounded-lg font-normal font-inter text-xs bp-540:text-sm tracking-[1px] shadow-md border border-vermelhoVibrante/20" type="submit" disabled>
                    ✗ Resultado Errado <span className="font-bold">+0 pts</span>
                </button>
            </div>
        )
    )
}