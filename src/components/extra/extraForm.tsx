"use client";

import { Crown, Loader2, Medal, Trophy } from "lucide-react";
import { useState } from "react";

type FormFeedback = {
    campea: string;
    artilheiro: string;
    vice: string;
};

const initialFeedback = {
    campea: "",
    artilheiro: "",
    vice: "",
};

export default function ExtraPicksForm() {
    const [pending, setPending] = useState(false);
    const [feedback, setFeedback] = useState<FormFeedback>(initialFeedback);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const campea = String(formData.get("campea") ?? "").trim();
        const artilheiro = String(formData.get("artilheiro") ?? "").trim();
        const vice = String(formData.get("vice") ?? "").trim();

        setPending(true);
        setFeedback({ campea, artilheiro, vice });

        window.setTimeout(() => {
            setPending(false);
        }, 400);
    }

    return (
        <section className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-6 shadow-sm">
            <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[#FFD700]" />
                <p className="font-inter text-xs font-bold tracking-[1.5px] text-[#FFD700]">
                    FORMULARIO DE PONTUACAO EXTRA
                </p>
            </div>

            <p className="mt-4 max-w-2xl font-inter text-sm leading-6 text-cinzaSuave">
                Escolha seus palpites e deixe o formulario pronto para o envio ao banco.
                Cada campo representa uma previsao individual do bolao.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-verdeNeon">
                        Janela privada
                    </p>
                    <p className="mt-2 font-inter text-sm leading-6 text-[#E8EDF5]">
                        Apenas voce consegue ver esta informacao dentro da sua conta.
                    </p>
                </div>

                <div className="rounded-xl border border-[#5ED5FF]/20 bg-[#5ED5FF]/10 px-4 py-4">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-[#5ED5FF]">
                        Data limite de envio
                    </p>
                    <p className="mt-2 font-inter text-sm leading-6 text-[#E8EDF5]">
                        O formulario pode ser enviado ate o fim da primeira rodada da Copa, em 17 de junho.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <label className="flex flex-col gap-2">
                    <span className="font-inter text-sm font-semibold text-[#E8EDF5]">
                        Selecao campea
                    </span>
                    <div className="relative">
                        <Crown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" size={18} />
                        <input
                            name="campea"
                            type="text"
                            placeholder="Ex: Argentina"
                            required
                            className="w-full rounded-[10px] border border-[#FFFFFF]/12 bg-transparent py-3 pl-11 pr-3 font-inter text-white placeholder-[#757575] transition-all duration-200 focus:border-verdeNeon/30 focus:outline-none focus:ring-2 focus:ring-verdeNeon/20"
                        />
                    </div>
                </label>

                <label className="flex flex-col gap-2">
                    <span className="font-inter text-sm font-semibold text-[#E8EDF5]">
                        Artilheiro da Copa
                    </span>
                    <div className="relative">
                        <Trophy className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" size={18} />
                        <input
                            name="artilheiro"
                            type="text"
                            placeholder="Ex: Mbappe"
                            required
                            className="w-full rounded-[10px] border border-[#FFFFFF]/12 bg-transparent py-3 pl-11 pr-3 font-inter text-white placeholder-[#757575] transition-all duration-200 focus:border-verdeNeon/30 focus:outline-none focus:ring-2 focus:ring-verdeNeon/20"
                        />
                    </div>
                </label>

                <label className="flex flex-col gap-2">
                    <span className="font-inter text-sm font-semibold text-[#E8EDF5]">
                        Vice-campeao
                    </span>
                    <div className="relative">
                        <Medal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" size={18} />
                        <input
                            name="vice"
                            type="text"
                            placeholder="Ex: Francia"
                            required
                            className="w-full rounded-[10px] border border-[#FFFFFF]/12 bg-transparent py-3 pl-11 pr-3 font-inter text-white placeholder-[#757575] transition-all duration-200 focus:border-verdeNeon/30 focus:outline-none focus:ring-2 focus:ring-verdeNeon/20"
                        />
                    </div>
                </label>

                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-cinzaSuave">
                        Ultimo envio registrado
                    </p>
                    <div className="mt-3 grid gap-2 text-sm text-[#E8EDF5] sm:grid-cols-3">
                        <span className="truncate">Campea: {feedback.campea || "-"}</span>
                        <span className="truncate">Artilheiro: {feedback.artilheiro || "-"}</span>
                        <span className="truncate">Vice: {feedback.vice || "-"}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-r from-verdeNeon to-[#22C55E] px-6 py-3 font-inter text-sm font-bold text-black transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-verdeNeon/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {pending && <Loader2 size={18} className="animate-spin" />}
                    {pending ? "Preparando envio..." : "Salvar palpites"}
                </button>
            </form>
        </section>
    );
}