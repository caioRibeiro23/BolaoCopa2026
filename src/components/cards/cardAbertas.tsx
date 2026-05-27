import Flag from "./iconePais/flag";
import CaixaPlacar from "./caixaPlacar/caixaPlacar";
import { getCountryAbbr } from "./iconePais/countryAbbr";
import { useState, FormEvent, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface CardAbertasProps {
    matchId: string;
    paisCasa: string;
    paisVisitante: string;
    hora: string;
    grupo: string;
    date_time?: string;
}

export default function CardAbertas({ matchId, paisCasa, paisVisitante, hora, grupo, date_time }: CardAbertasProps) {
    const [predictionHome, setPredictionHome] = useState<number | null>(null);
    const [predictionAway, setPredictionAway] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);

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
        <form onSubmit={handleSendPrediction} className="w-full flex flex-col bg-azulMedio rounded-2xl border border-gray-800 shadow-2xl">

            {/* Cabeçalho do Card */}
            <div className="w-full flex justify-between px-5 py-3 bg-azulCinzado shadow-inner rounded-t-2xl text-xs font-inter border-b border-gray-800">
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
                    <span className="text-verdeNeon tracking-[1px]">OPEN</span> 
                    <span className="text-cinzaSuave whitespace-nowrap">{hora}</span>
                </div>
                <div className="text-cinzaSuave w-full text-end bp-540:text-center">Grupo {grupo}</div>
                <div className="text-verdeNeon w-full text-end font-roboto hidden bp-540:block"> +3 pts placar exato / +1 pt resultado</div>
            </div>

            {/* Corpo do Card */}
            <div className="w-full px-2 bp-540:px-6 py-5 flex flex-row items-center">
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
                        className={`px-4 py-2 rounded-lg font-bold font-inter text-sm tracking-[1px] duration-200 hover:scale-105 transition-all disabled:scale-100 ${isSaved ? "bg-transparent text-verdeNeon font-normal cursor-default" : "bg-verdeNeon text-black hover:bg-verdeNeon/70 shadow-md cursor-pointer" }`}
                        type="submit"
                    >
                        {isSubmitting ? "Enviando..." : isSaved ? "Palpite Registrado ✓" : "Enviar Palpite →"}
                    </button>

                    {isSaved && (
                        <button
                            type="button"
                            onClick={handleEditPrediction}
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg font-bold font-inter text-sm tracking-[1px] bg-transparent text-verdeNeon border border-verdeNeon/35 shadow-md hover:bg-verdeNeon/10 hover:scale-105 transition-all cursor-pointer disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
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