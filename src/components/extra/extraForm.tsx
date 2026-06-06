"use client";

import { Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { TeamAutocomplete } from "../ui/teamAutoComplete";
import { selecoesCopa2026 } from "@/src/utils/traducaoPaises";
import { saveExtraPrediction } from "@/src/lib/supabase/extra-predictions";

interface ExtraPicksFormProps {
    initialPrediction?: {
        champion_team: string;
        runner_up_team: string;
        top_scorer: string;
    } | null;
}


export default function ExtraPicksForm({ initialPrediction }: ExtraPicksFormProps) {
    const [pending, setPending] = useState(false);
    const [feedback, setFeedback] = useState({
        campea: initialPrediction?.champion_team ?? "",
        vice: initialPrediction?.runner_up_team ?? "",
        artilheiro: initialPrediction?.top_scorer ?? "",
    });

    const DEADLINE = new Date("2026-06-18T00:00:00-03:00");
    const isClosed = new Date() >= DEADLINE;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(isClosed) {
             return;
        }

        try{
            const formData = new FormData(event.currentTarget);
            const campea = String(formData.get("campea") ?? "").trim();
            const artilheiro = String(formData.get("artilheiro") ?? "").trim();
            const vice = String(formData.get("vice") ?? "").trim();

            await saveExtraPrediction({
                championTeam: campea,
                runnerUpTeam: vice,
                topScorer: artilheiro,
            });

            setPending(true);
            setFeedback({ campea, artilheiro, vice });

            window.setTimeout(() => {
                setPending(false);
            }, 400);
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
        }
    }

    return (
        <section className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-6 shadow-sm">
            <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[#FFD700]" />
                <p className="font-inter text-xs font-bold tracking-[1.5px] text-[#FFD700]">
                    FORMULÁRIO DE PONTUAÇÃO EXTRA
                </p>
            </div>

            <p className="mt-4 max-w-2xl font-inter text-sm leading-6 text-cinzaSuave">
                Escolha seus palpites e deixe o formulário pronto para o envio ao banco.
                Cada campo representa uma previsão individual do bolão.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-verdeNeon">
                        Janela privada
                    </p>
                    <p className="mt-2 font-inter text-sm leading-6 text-[#E8EDF5]">
                        Apenas você consegue ver esta informação dentro da sua conta.
                    </p>
                </div>

                <div className="rounded-xl border border-[#5ED5FF]/20 bg-[#5ED5FF]/10 px-4 py-4">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-[#5ED5FF]">
                        Data limite de envio
                    </p>
                    <p className="mt-2 font-inter text-sm leading-6 text-[#E8EDF5]">
                        O formulário pode ser enviado até o fim da primeira rodada da Copa, em 17 de junho.
                    </p>
                </div>
            </div>

            {isClosed && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm font-medium text-red-300">
                        O prazo para envio dos palpites extras foi encerrado.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <TeamAutocomplete
                    label="Seleção campeã"
                    name="campea"
                    placeholder="Ex: Brasil"
                    teams={selecoesCopa2026}
                    disabled={isClosed}
                />

                <TeamAutocomplete
                    label="Seleção vice-campeã"
                    name="vice"
                    placeholder="Ex: Argentina"
                    teams={selecoesCopa2026}
                    disabled={isClosed}
                />

                <label className="flex flex-col gap-2">
                    <span className="font-inter text-sm font-semibold text-[#E8EDF5]">
                        Artilheiro da Copa
                    </span>
                    <div className="relative">
                        <input
                            name="artilheiro"
                            type="text"
                            placeholder="Ex: Rayan"
                            required
                            className="w-full rounded-[10px] border border-[#FFFFFF]/12 bg-transparent py-3 px-4 font-inter text-white placeholder-[#757575] transition-all duration-200 focus:border-verdeNeon/30 focus:outline-none focus:ring-2 focus:ring-verdeNeon/20"
                            disabled={isClosed}
                        />
                    </div>
                </label>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-cinzaSuave">
                        Último envio registrado
                    </p>
                    <div className="mt-3 grid gap-2 text-sm text-[#E8EDF5] sm:grid-cols-3">
                        <span className="truncate">Campeã: {feedback.campea || "-"}</span>
                        <span className="truncate">Artilheiro: {feedback.artilheiro || "-"}</span>
                        <span className="truncate">Vice-campeão: {feedback.vice || "-"}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isClosed || pending}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-r from-verdeNeon to-[#22C55E] px-6 py-3 font-inter text-sm font-bold text-black transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-verdeNeon/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {pending && <Loader2 size={18} className="animate-spin" />}
                    {
                        isClosed
                            ? "Prazo encerrado"
                            : pending
                                ? "Preparando envio..."
                                : "Salvar palpites"
                    }
                </button>
            </form>
        </section>
    );
}