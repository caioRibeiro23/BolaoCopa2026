import TitlePage from "@/src/components/ui/titlepage";
import ExtraPicksForm from "@/src/components/extra/extraForm";
import { Crown, Medal, Trophy } from "lucide-react";
import { getExtraPrediction } from "@/src/lib/supabase/extra-predictions";

const extraRules = [
    {
        title: "Selecao campea",
        points: 10,
        description: "Palpite sobre quem levanta a taça no fim da Copa.",
        icon: Crown,
        accent: "text-verdeNeon",
        glow: "shadow-[0_0_14px_rgba(57,255,20,0.35)]",
    },
    {
        title: "Vice-campeao",
        points: 5,
        description: "A selecao que chega na final, mas termina em segundo lugar.",
        icon: Medal,
        accent: "text-[#5ED5FF]",
        glow: "shadow-[0_0_14px_rgba(94,213,255,0.3)]",
    },
    {
        title: "Artilheiro da Copa",
        points: 9,
        description: "O jogador que mais marca gols durante todo o torneio.",
        icon: Trophy,
        accent: "text-[#FFD86B]",
        glow: "shadow-[0_0_14px_rgba(255,216,107,0.3)]",
    },
];

export default async function ExtraPage() {

    const prediction = await getExtraPrediction();

    return (
        <div className="min-h-screen w-full bg-azulEscuro px-8 py-16 md:px-14 md:py-17">
            <div className="flex flex-col gap-8">
                <TitlePage title="Pontuação Extra" />

                <section className="relative overflow-hidden rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-7 shadow-sm md:px-8 md:py-8">
                    <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-verdeNeon/10 blur-3xl" />
                    <div className="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-azulClaroSuave/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded-full border border-verdeNeon/35 bg-verdeNeon/10 px-3 py-1 font-inter text-[11px] font-bold tracking-[1.5px] text-verdeNeon">
                                PONTOS EXTRAS PRIVADOS
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="font-bebas-neue text-4xl tracking-[2px] text-[#E8EDF5] md:text-5xl">
                                Para que servem esses palpites
                            </h2>
                            <p className="max-w-3xl font-inter text-sm leading-6 text-cinzaSuave md:text-base">
                                Esses palpites valem pontos extras e ficam visíveis apenas para o próprio usuário.
                                Eles ajudam a premiar previsões de longo prazo sobre a campeã, o vice e o artilheiro da Copa.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {extraRules.map((rule) => {
                                const Icon = rule.icon;

                                return (
                                    <article
                                        key={rule.title}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-4"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ${rule.glow}`}>
                                                <Icon size={20} className={rule.accent} />
                                            </div>
                                            <span className="font-bebas-neue text-3xl tracking-[2px] text-[#E8EDF5]">
                                                +{rule.points}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 font-inter text-sm font-bold uppercase tracking-[1.5px] text-[#E8EDF5]">
                                            {rule.title}
                                        </h3>
                                        <p className="mt-2 font-inter text-sm leading-6 text-cinzaSuave">
                                            {rule.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <ExtraPicksForm initialPrediction={prediction} />
            </div>
        </div>
    );
}