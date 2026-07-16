import Flag from "./iconePais/flag";
import CaixaPlacarFechado from "./caixaPlacar/caixaPlacarFechado";
import { getCountryAbbr } from "./iconePais/countryAbbr";
import { getPhaseLabel } from "@/src/utils/getPhaseLabel";
import type { TournamentMatchPhase } from "@/src/lib/supabase/tournament";

interface CardAoVivoProps {
    paisCasa: string;
    paisVisitante: string;
    grupo: string;
    tempo: string;
    placarCasa: number;
    placarVisitante: number;
    palpiteCasa?: number;
    palpiteVisitante?: number;
    phase: TournamentMatchPhase;
}

export default function CardAoVivo({ paisCasa, paisVisitante, grupo, tempo, placarCasa, placarVisitante, palpiteCasa, palpiteVisitante, phase }: CardAoVivoProps) {
    const isFinal = phase === "final";

    return (
        <div className={`w-full flex flex-col bg-azulMedio rounded-2xl border shadow-2xl ${isFinal ? "border-[#d4af37]/80 shadow-[0_0_30px_rgba(212,175,55,0.18)]" : "border-gray-800"}`}>

            {/* Cabeçalho do Card */}
            <div className={`w-full flex justify-between px-5 py-3 shadow-inner rounded-t-2xl text-xs font-inter border-b ${isFinal ? "bg-linear-to-r from-[#3f2e09] via-[#8b6a1d] to-[#251902] border-[#d4af37]/70" : "bg-verdeNeon/5 border-gray-800"}`}>
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className={`w-2 h-2 aspect-square rounded-4xl ${isFinal ? "bg-[#ffd86b] shadow-[0_0_10px_rgba(212,175,55,0.9)]" : "bg-vermelhoVibrante shadow-[0_0_8px_#FF4C4C]"}`}></div>
                    <span className={`tracking-[1px] ${isFinal ? "text-[#ffd86b]" : "text-vermelhoVibrante"}`}>{isFinal ? "FINAL" : "Live"}</span> 
                    <span className={isFinal ? "text-amber-100" : "text-cinzaSuave"}>{isFinal ? "FT" : `${tempo}'`}</span>
                </div>
                {phase !== "group_stage" ? (
                    <div className={`w-full text-end bp-540:text-center ${isFinal ? "text-[#ffd86b] font-semibold" : "text-cinzaSuave"}`}>{getPhaseLabel(phase)}</div>
                ) : (
                    <div className={`w-full text-end bp-540:text-center ${isFinal ? "text-[#ffd86b] font-semibold" : "text-cinzaSuave"}`}>Grupo {grupo}</div>
                )}
                <div className={`w-full text-end font-roboto hidden bp-540:block ${isFinal ? "text-[#ffd86b]" : "text-verdeNeon"}`}>{isFinal ? " +18 pts cravada / +3 pt resultado" : " +9 pts placar exato / +3 pt resultado"}</div>
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
                <div className="w-full py-2 text-end text-cinzaSuave font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3 justify-end">
                    <span className="hidden md:block">{paisVisitante}</span>
                    <span className="hidden bp-540:block md:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
                    <Flag country={paisVisitante} />
                    <span className="bp-540:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
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