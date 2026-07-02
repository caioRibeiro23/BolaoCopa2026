import Flag from "./iconePais/flag";
import CaixaPlacarEncerrado from "./caixaPlacar/caixaPlacarEncerrado";
import { getCountryAbbr } from "./iconePais/countryAbbr";
import ResultCard from "../ui/resultCard";
import { getPhaseLabel } from "@/src/utils/getPhaseLabel";
import type { TournamentMatchPhase } from "@/src/lib/supabase/tournament";

interface CardAoVivoProps {
    paisCasa: string;
    paisVisitante: string;
    grupo: string;
    placarCasa: number;
    placarVisitante: number;
    palpiteCasa?: number;
    palpiteVisitante?: number;
    phase: TournamentMatchPhase;
}

export type StatusPontuacao = "exato" | "combo" | "resultado" | "um_gol" | "incorreto" | undefined;

export default function CardEncerradas({ paisCasa, paisVisitante, grupo, placarCasa, placarVisitante, palpiteCasa, palpiteVisitante, phase }: CardAoVivoProps) {
    let status: StatusPontuacao = undefined;
    if (palpiteCasa !== undefined && palpiteVisitante !== undefined) {
        const acertouGolCasa = palpiteCasa === placarCasa;
        const acertouGolVisitante = palpiteVisitante === placarVisitante;
        
        const saldoPalpite = palpiteCasa - palpiteVisitante;
        const saldoReal = placarCasa - placarVisitante;
        const acertouVencedor = Math.sign(saldoPalpite) === Math.sign(saldoReal);

        // 🧠 Árvore de Decisão do Front (Espelhando o seu banco de dados)
        if (acertouGolCasa && acertouGolVisitante) {
            status = "exato"; // 9 pontos
        } else if (acertouVencedor && (acertouGolCasa || acertouGolVisitante)) {
            status = "combo"; // 5 pontos
        } else if (acertouVencedor) {
            status = "resultado"; // 3 pontos
        } else if (acertouGolCasa || acertouGolVisitante) {
            status = "um_gol"; // 1 ponto
        } else {
            status = "incorreto"; // 0 pontos
        }
    }
    return (
        <div className="w-full flex flex-col bg-azulMedio rounded-2xl border border-gray-800 shadow-2xl">

            {/* Cabeçalho do Card */}
            <div className="w-full flex justify-between px-5 py-3 bg-[#111a2e] shadow-inner rounded-t-2xl text-xs font-inter border-b border-gray-800">
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className="w-2 h-2 aspect-square rounded-4xl bg-cinzaSuave"></div>
                    <span className="text-cinzaSuave tracking-[1px] font-bold font-inter">ENCERRADA</span> 
                    <span className="text-cinzaSuave">FT</span>
                </div>
                {phase !== "group_stage" ? (
                    <div className="text-cinzaSuave w-full text-end bp-540:text-center">{getPhaseLabel(phase)}</div>
                ) : (
                    <div className="text-cinzaSuave w-full text-end bp-540:text-center">Grupo {grupo}</div>
                )}
                <div className="text-verdeNeon w-full text-end font-roboto hidden bp-540:block"> +9 pts placar exato / +3 pt resultado</div>
            </div>

            {/* Corpo do Card */}
            <div className="w-full px-6 py-5 flex flex-row items-center">
                <div className="w-full py-2 text-start text-cinzaSuave font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3">
                    <Flag country={paisCasa} />
                    <span className="md:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisCasa)}</span>
                    <span className="hidden md:block">{paisCasa}</span>
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
                <div className="w-full py-2 text-end text-cinzaSuave font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3 justify-end">
                    <span className="hidden md:block">{paisVisitante}</span>
                    <span className="hidden bp-540:block md:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
                    <Flag country={paisVisitante} />
                    <span className="bp-540:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
                </div>

            </div>

            {/* Rodapé do Card */}
            <ResultCard status={status} />
        </div>
    );
}