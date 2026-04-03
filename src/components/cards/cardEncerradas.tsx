import Flag from "./iconePais/flag";
import CaixaPlacarEncerrado from "./caixaPlacar/caixaPlacarEncerrado";
import { getCountryAbbr } from "./iconePais/countryAbbr";


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

export default function CardEncerradas({ paisCasa, paisVisitante, grupo, placarCasa, placarVisitante, palpiteCasa, palpiteVisitante }: CardAoVivoProps) {
    let status: string | undefined;
    status = undefined;
    if(palpiteCasa !==undefined && palpiteVisitante !==undefined) {
        const saldoPalpite = palpiteCasa - palpiteVisitante;
        const saldoReal = placarCasa - placarVisitante;
        const acertouVencedor = Math.sign(saldoPalpite) === Math.sign(saldoReal);
        status = (acertouVencedor ? (palpiteCasa === placarCasa && palpiteVisitante === placarVisitante ? "exato" : "resultado") : "incorreto");
    }
    return (
        <div className="w-full flex flex-col bg-azulMedio rounded-2xl">

            {/* Cabeçalho do Card */}
            <div className="w-full flex justify-between px-5 py-3 bg-[#FF4455]/5 shadow-inner rounded-t-2xl text-xs font-inter">
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className="w-2 h-2 aspect-square rounded-4xl bg-cinzaSuave"></div>
                    <span className="text-cinzaSuave tracking-[1px] font-bold font-inter">ENCERRADA</span> 
                    <span className="text-cinzaSuave">FT</span>
                </div>
                <div className="text-cinzaSuave w-full text-end bp-540:text-center">Grupo {grupo}</div>
                <div className="text-verdeNeon w-full text-end font-roboto hidden bp-540:block"> +3 pts placar exato / +1 pt resultado</div>
            </div>

            {/* Corpo do Card */}
            <div className="w-full px-6 py-5 flex flex-row items-center">
                <div className="w-full py-2 text-start text-white font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3">
                    <Flag country={paisCasa} />
                    <span className="bp-540:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisCasa)}</span>
                    <span className="hidden bp-540:block">{paisCasa}</span>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2 justify-center items-center">
                        <CaixaPlacarEncerrado placar={palpiteCasa} />
                        <div className="py-2">
                            <div className="px-1 pt-7 pb-3">
                                <span className="text-lg text-cinzaSuave">:</span>
                            </div>

                        </div>
                        <CaixaPlacarEncerrado placar={palpiteVisitante} />
                    </div>
                    <div className="px-10 flex flex-col justify-center items-center gap-1 ml-2">
                        <h2 className="font-inter text-xs text-cinzaSuave whitespace-nowrap">Placar Final</h2>
                        <p className="font-bebas-neue text-3xl tracking-[3px] text-cinzaSuave "> {placarCasa} : {placarVisitante}</p>
                    </div>
                </div>
                <div className="w-full py-2 text-end text-white font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3 justify-end">
                    <span className="hidden bp-540:block">{paisVisitante}</span>
                    <Flag country={paisVisitante} />
                    <span className="bp-540:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
                </div>

            </div>

            {/* Rodapé do Card */}
            {status === undefined ? (
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
            )}
        </div>
    );
}