import Flag from "./iconePais/flag";
import CaixaPlacar from "./caixaPlacar/caixaPlacar";
import CaixaPlacarFechado from "./caixaPlacar/caixaPlacarFechado";

interface CardAoVivoProps {
    paisCasa: string;
    paisVisitante: string;
    grupo: string;
    tempo: string;
    placarCasa: number;
    placarVisitante: number;
    palpiteCasa?: number;
    palpiteVisitante?: number;
}

export default function CardAoVivo({ paisCasa, paisVisitante, grupo, tempo, placarCasa, placarVisitante, palpiteCasa, palpiteVisitante }: CardAoVivoProps) {
    return (
        <div className="w-full flex flex-col bg-azulMedio rounded-2xl">

            {/* Cabeçalho do Card */}
            <div className="w-full flex justify-between px-5 py-3 bg-azulCinzado shadow-inner rounded-t-2xl text-xs font-inter">
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className="w-2 h-2 aspect-square rounded-4xl bg-vermelhoVibrante shadow-[0_0_8px_#FF4C4C]"></div>
                    <span className="text-vermelhoVibrante tracking-[1px]">Live</span> 
                    <span className="text-cinzaSuave">{tempo}&apos;</span>
                </div>
                <div className="text-cinzaSuave w-full text-center">Grupo {grupo}</div>
                <div className="text-verdeNeon w-full text-end font-roboto"> +3 pts placar exato / +1 pt resultado</div>
            </div>

            {/* Corpo do Card */}
            <div className="w-full px-6 py-5 flex flex-row items-center">
                <div className="w-full py-2 text-start text-white font-bold font-inter text-base flex flex-row items-center gap-3">
                    <Flag country={paisCasa} />
                    <span>{paisCasa}</span>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2 justify-center items-center">
                        <CaixaPlacarFechado placar={palpiteCasa} />
                        <div className="py-2">
                            <div className="px-1 pt-7 pb-3">
                                <span className="text-lg text-cinzaSuave">:</span>
                            </div>

                        </div>
                        <CaixaPlacarFechado placar={palpiteVisitante} />
                    </div>
                    <div className="px-10 flex flex-col justify-center items-center gap-1 ml-2">
                        <h2 className="font-inter text-xs text-cinzaSuave whitespace-nowrap">Placar ao Vivo</h2>
                        <p className="font-bebas-neue text-3xl tracking-[3px] text-verdeNeon drop-shadow-[0_0_8px_#39FF14]"> {placarCasa} : {placarVisitante}</p>
                    </div>
                </div>
                <div className="w-full py-2 text-end text-white font-bold font-inter text-base flex flex-row items-center gap-3 justify-end">
                    <span>{paisVisitante}</span>
                    <Flag country={paisVisitante} />
                </div>

            </div>

            {/* Rodapé do Card */}
            <div className="w-full flex justify-center items-center pb-5">
                <button className="px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] rounded-lg font-normal font-inter text-sm tracking-[1px] shadow-md border border-[#FFD700]/25" type="submit" disabled>
                    Palpites Bloqueados 🔒
                </button>
            </div>
        </div>
    );
}