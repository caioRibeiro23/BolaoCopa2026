import TitlePage from "@/src/components/ui/titlepage";
import { CalendarClock, Goal, Lock, Medal, ShieldCheck, Trophy } from "lucide-react";

const scoreRules = [
    {
        title: "Placar exato",
        points: 9,
        description: "Acertou os gols dos dois times com exatidao.",
        icon: Goal,
        color: "text-verdeNeon",
        glow: "shadow-[0_0_14px_rgba(57,255,20,0.4)]",
    },
    {
        title: "Resultado da partida",
        points: 3,
        description: "Acertou quem vence ou se termina empatado.",
        icon: ShieldCheck,
        color: "text-[#5ED5FF]",
        glow: "shadow-[0_0_14px_rgba(94,213,255,0.35)]",
    },
    {
        title: "Gols de um time",
        points: 1,
        description: "Acertou a quantidade de gols de pelo menos uma selecao.",
        icon: Medal,
        color: "text-[#FFD86B]",
        glow: "shadow-[0_0_14px_rgba(255,216,107,0.35)]",
    },
];

const extraPredictions = [
    {
        label: "Artilheiro da Copa",
        points: 9,
    },
    {
        label: "Campeao",
        points: 10,
    },
    {
        label: "Vice-campeao",
        points: 5,
    },
];

export default function RulesPage() {
    return (
        <div className="min-h-screen w-full bg-azulEscuro px-8 py-16 md:px-14 md:py-17">
            <div className="flex flex-col gap-8">
                <TitlePage title="Regras do Bolao" />

                <section className="relative overflow-hidden rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-7 shadow-sm md:px-8 md:py-8">
                    <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-verdeNeon/10 blur-3xl" />
                    <div className="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-azulClaroSuave/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded-full border border-verdeNeon/35 bg-verdeNeon/10 px-3 py-1 font-inter text-[11px] font-bold tracking-[1.5px] text-verdeNeon">
                                Bolão Copa 2026
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="font-bebas-neue text-4xl tracking-[2px] text-[#E8EDF5] md:text-5xl">
                                Como funciona a pontuacao
                            </h2>
                            <p className="max-w-3xl font-inter text-sm leading-6 text-cinzaSuave md:text-base">
                                Cada partida pode render pontos por acerto de placar, resultado e gols por equipe.
                                Alem disso, existem previsoes extras de longo prazo e regras especiais para as fases finais.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {scoreRules.map((rule) => {
                        const Icon = rule.icon;

                        return (
                            <article
                                key={rule.title}
                                className="rounded-2xl border border-azulCinzado bg-azulMedio px-5 py-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ${rule.glow}`}>
                                        <Icon size={20} className={rule.color} />
                                    </div>
                                    <span className="font-bebas-neue text-4xl tracking-[2px] text-[#E8EDF5]">
                                        +{rule.points}
                                    </span>
                                </div>

                                <h3 className="mt-5 font-inter text-sm font-bold uppercase tracking-[1.5px] text-[#E8EDF5]">
                                    {rule.title}
                                </h3>
                                <p className="mt-2 font-inter text-sm leading-6 text-cinzaSuave">
                                    {rule.description}
                                </p>
                            </article>
                        );
                    })}
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <article className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-verdeNeon shadow-[0_0_8px_#39FF14]" />
                            <p className="font-inter text-xs font-bold tracking-[1.5px] text-verdeNeon">
                                COMBOS E REGRAS ESPECIAIS
                            </p>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                                <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-cinzaSuave">
                                    Combo
                                </p>
                                <p className="mt-2 font-inter text-sm leading-6 text-[#E8EDF5]">
                                    Se acertar o resultado da partida e a quantidade de gols de um dos times no mesmo jogo,
                                    o palpite recebe <span className="font-bold text-verdeNeon">+5 pontos</span> no combo.
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#FFD700]/35 bg-[#FFD700]/10 px-4 py-4">
                                <p className="font-inter text-xs font-semibold uppercase tracking-[1.5px] text-[#FFD86B]">
                                    Grande final
                                </p>
                                <p className="mt-2 font-inter text-sm leading-6 text-[#FFF2C4]">
                                    Na final, acertar o placar exato vale o dobro:
                                    <span className="ml-1 font-bebas-neue text-2xl tracking-[1.5px] text-[#FFD700]">18 pontos</span>.
                                </p>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarClock size={16} className="text-[#5ED5FF]" />
                            <p className="font-inter text-xs font-bold tracking-[1.5px] text-[#5ED5FF]">
                                JANELA DE PALPITES
                            </p>
                        </div>

                        <p className="mt-4 font-inter text-sm leading-6 text-cinzaSuave">
                            Os usuários podem apostar em todos os jogos da 
                            <span className="mx-1 font-semibold text-[#E8EDF5]">rodada atual até o seu último dia.</span>
                            Faltando 2 dias para a rodada terminar, os palpites da próxima rodada serão abertos automaticamente.
                        </p>
                    </article>
                </section>

                {/* Seção Pontos Extras Privados */}
                <section className="rounded-2xl border border-azulCinzado bg-azulMedio px-4 py-5 sm:px-6 sm:py-6 shadow-sm w-full overflow-hidden">
                    <div className="flex items-center gap-2">
                        <Lock size={16} className="text-[#FF8FB1] shrink-0" />
                        <p className="font-inter text-xs font-bold tracking-[1.5px] text-[#FF8FB1]">
                            PONTOS EXTRAS PRIVADOS
                        </p>
                    </div>

                    <p className="w-full mt-4  font-inter text-sm leading-6 text-cinzaSuave">
                        Os palpites extras sao individuais: cada usuario visualiza apenas os proprios extras,
                        sem acesso aos dados dos demais participantes.
                    </p>

                    {/* Grid de Cards Extras */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        {extraPredictions.map((item) => (
                            <div
                                key={item.label}
                                /* 
                                🎯 SOLUÇÃO DO BUG GRÁFICO:
                                - transform-gpu: Força uma camada 3D limpa na GPU
                                - [backface-visibility:hidden]: Impede que renderizações fantasmas se sobreponham
                                */
                                className="min-w-0 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between gap-2 transform-gpu [backface-visibility:hidden]"
                            >
                                <p className="break-words font-inter text-[11px] font-semibold uppercase leading-4 tracking-[1.3px] text-cinzaSuave sm:text-xs">
                                    {item.label}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <Trophy size={16} className="shrink-0 text-[#FFD700]" />
                                    <span className="min-w-0 font-bebas-neue text-2xl tracking-[1.5px] text-[#FFD700] sm:text-3xl">
                                        +{item.points}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}