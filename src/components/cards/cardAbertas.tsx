"use client";

import Flag from "./iconePais/flag";
import CaixaPlacar from "./caixaPlacar/caixaPlacar";
import { getCountryAbbr } from "./iconePais/countryAbbr";
import { useState, FormEvent, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { TournamentMatchPhase } from "@/src/lib/supabase/tournament";
import { getPhaseLabel } from "@/src/utils/getPhaseLabel";

interface CardAbertasProps {
    matchId: string;
    paisCasa: string;
    paisVisitante: string;
    hora: string;
    grupo: string;
    date_time?: string;
    phase: TournamentMatchPhase;
}


export default function CardAbertas({ matchId, paisCasa, paisVisitante, hora, grupo, date_time, phase }: CardAbertasProps) {
    const [predictionHome, setPredictionHome] = useState<number | null>(null);
    const [predictionAway, setPredictionAway] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const isFinal = phase === "final";

    const supabase = createClient();

    function handleHomeChange(value: number | null) {
        if (isSaved) return;
        setPredictionHome(value);
        setIsSaved(false);
    }

    function handleAwayChange(value: number | null) {
        if (isSaved) return;
        setPredictionAway(value);
        setIsSaved(false);
    }

    function handleEditPrediction() {
        if (isSubmitting) return;
        if (date_time) {
            const agora = new Date();
            const horarioJogo = new Date(date_time);

            if (agora.getTime() >= horarioJogo.getTime()) {
                alert("As apostas para esta partida já foram encerradas! Não é possível editar.");
                return;
            }
        }
        setIsSaved(false);
    }

    useEffect(() => {
        async function fetchExistingPrediction() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("bets")
                .select("prediction_home, prediction_away")
                .eq("user_id", user.id)
                .eq("match_id", matchId)
                .maybeSingle(); // Retorna o objeto se existir, ou null se não encontrar

            if (!error && data) {
                setPredictionHome(data.prediction_home);
                setPredictionAway(data.prediction_away);
                setIsSaved(true);
            }
            if (error) {
                console.error("Erro na busca do palpite:", error.message);
            }
        }

        fetchExistingPrediction();
    }, [matchId, supabase]);

    async function handleSendPrediction(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        if (date_time) {
            const agora = new Date();
            const horarioJogo = new Date(date_time);

            if (agora.getTime() >= horarioJogo.getTime()) {
                alert("As apostas para esta partida já foram encerradas! Seu palpite não foi enviado.");
                setIsSubmitting(false);
                return;
            }
        }

        try {
        //Pega a sessão do usuário logado diretamente pelo Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            alert("Você precisa estar logado para enviar um palpite!");
            setIsSubmitting(false);
            return;
        }

        // Faz o upsert baseado nas restrições (user_id, match_id) da sua tabela bets
        const { error } = await supabase
            .from("bets")
            .upsert({
            user_id: user.id,
            match_id: matchId,
            prediction_home: predictionHome ?? 0,
            prediction_away: predictionAway ?? 0,
            updated_at: new Date().toISOString()
            }, {
            onConflict: "user_id,match_id" // Garante o overwrite se já existir
            });

        if (error) {
            throw error;
        }

        setIsSaved(true);
        } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Erro ao salvar palpite:", err.message);
        } else {
            console.error("Erro ao salvar palpite:", err);
        }
        alert("Houve um erro técnico ao salvar seu palpite.");
        } finally {
        setIsSubmitting(false);
        }
    }
    return (
        <form
            onSubmit={handleSendPrediction}
            className={`w-full flex flex-col bg-azulMedio rounded-2xl border shadow-2xl ${isFinal ? "border-[#d4af37]/80 shadow-[0_0_30px_rgba(212,175,55,0.18)]" : "border-gray-800"}`}
        >

            {/* Cabeçalho do Card */}
            <div className={`w-full flex justify-between px-5 py-3 shadow-inner rounded-t-2xl text-xs font-inter border-b ${isFinal ? "bg-linear-to-r from-[#3f2e09] via-[#8b6a1d] to-[#251902] border-[#d4af37]/70" : "bg-azulCinzado border-gray-800"}`}>
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className={`w-2 h-2 aspect-square rounded-4xl shadow-[0_0_8px_rgba(255,255,255,0.3)] ${isFinal ? "bg-[#ffd86b] shadow-[0_0_10px_rgba(212,175,55,0.9)]" : "bg-verdeNeon shadow-[0_0_8px_#39FF14]"}`}></div>
                    <span className={`tracking-[1px] ${isFinal ? "text-[#ffd86b]" : "text-verdeNeon"}`}>{isFinal ? "FINAL" : "OPEN"}</span> 
                    <span className={`whitespace-nowrap ${isFinal ? "text-amber-100" : "text-cinzaSuave"}`}>{hora}</span>
                </div>
                {phase !== "group_stage" ? (
                    <div className={`w-full text-end bp-540:text-center ${isFinal ? "text-[#ffd86b] font-semibold" : "text-cinzaSuave"}`}>{getPhaseLabel(phase)}</div>
                ) : 
                    <div className={`w-full text-end bp-540:text-center ${isFinal ? "text-[#ffd86b] font-semibold" : "text-cinzaSuave"}`}>Grupo {grupo}</div>}
                <div className={`w-full text-end font-roboto hidden bp-540:block ${isFinal ? "text-[#ffd86b]" : "text-verdeNeon"}`}>{isFinal ? " +18 pts cravada / +3 pt resultado" : " +9 pts placar exato / +3 pt resultado"}</div>
            </div>
    

            {/* Corpo do Card */}
            <div className="w-full px-2 bp-540:px-6 py-8 flex flex-row items-center">
                <div className="w-full py-2 text-start text-cinzaSuave font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3">
                    <Flag country={paisCasa} />
                    <span className="md:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisCasa)}</span>
                    <span className="hidden md:block">{paisCasa}</span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <CaixaPlacar 
                        casaOuVisitante="casa" 
                        value={predictionHome} 
                        onChange={handleHomeChange}
                        disabled={isSaved}
                        isFinal={isFinal}
                    />
                    <div className="py-2">
                        <div className="px-1 pt-7 pb-3">
                            <span className="text-lg text-cinzaSuave">:</span>
                        </div>

                    </div>
                    <CaixaPlacar
                        casaOuVisitante="visitante"
                        value={predictionAway}
                        onChange={handleAwayChange}
                        disabled={isSaved}
                        isFinal={isFinal}
                    />
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
                <div className="flex flex-col items-center gap-3">
                    <button 
                        disabled={isSubmitting || isSaved}
                        className={`px-4 py-2 rounded-lg font-bold font-inter text-sm tracking-[1px] duration-200 hover:scale-105 transition-all disabled:scale-100 ${isSaved ? `bg-transparent ${isFinal ? "text-[#ffd86b]" : "text-verdeNeon"} font-normal cursor-default` : `${isFinal ? "bg-linear-to-r from-[#3f2e09] via-[#8b6a1d] to-[#251902] text-[#ffd86b] hover:opacity-80" : "bg-verdeNeon text-black hover:bg-verdeNeon/70"} shadow-md cursor-pointer` }`}
                        type="submit"
                    >
                        {isSubmitting ? "Enviando..." : isSaved ? <span className="text-[#ad872f]">Palpite Registrado ✓</span> : "Enviar Palpite →"}
                    </button>

                    {isSaved && (
                        <button
                            type="button"
                            onClick={handleEditPrediction}
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg font-bold font-inter text-sm tracking-[1px] bg-transparent ${isFinal ? "text-[#ad872f] border border-[#8b6a1d]/35 hover:bg-[#8b6a1d]/10" : "text-verdeNeon border border-verdeNeon/35 hover:bg-verdeNeon/10"} shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed`}
                        >
                            Editar Palpite
                        </button>
                    )}
                </div>
            </div>
        {/* <img 
  src={`https://flagcdn.com/w40/${codCasa.toLowerCase()}.png`} 
  alt={paisCasa}
  className="w-6 h-auto rounded-sm"
/> */}
        </form>
    );
}