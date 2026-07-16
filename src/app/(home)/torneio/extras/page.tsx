import { Crown, Medal, Trophy } from "lucide-react";
import TitlePage from "@/src/components/ui/titlepage";
import BackButton from "@/src/components/ui/backButton";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import { getExtraPredictionsWithUsers } from "@/src/lib/supabase/extra-predictions";

type ExtrasSearchParams = {
  userId?: string;
};

interface ExtrasPageProps {
  searchParams?: Promise<ExtrasSearchParams>;
}

const extraCards = [
  {
    key: "champion_team",
    label: "Campeão +10pts",
    icon: Crown,
    accent: "text-verdeNeon",
    cardClass: "border-verdeNeon/20 bg-verdeNeon/10",
  },
  {
    key: "runner_up_team",
    label: "Vice +5pts",
    icon: Medal,
    accent: "text-[#5ED5FF]",
    cardClass: "border-[#5ED5FF]/20 bg-[#5ED5FF]/10",
  },
  {
    key: "top_scorer",
    label: "Artilheiro +9pts",
    icon: Trophy,
    accent: "text-[#FFD86B]",
    cardClass: "border-[#FFD86B]/20 bg-[#FFD86B]/10",
  },
] as const;

export default async function ExtrasPage({ searchParams }: ExtrasPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedUserId = resolvedSearchParams.userId || user.id;
        const selectedPredictions = await getExtraPredictionsWithUsers(selectedUserId);
        const selectedPrediction = selectedPredictions[0] ?? null;

  return (
    <div className="w-full bg-azulEscuro px-4 py-6 pb-8 sm:px-5 md:px-14 md:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:gap-8">
        <div className="flex items-start justify-start">
          <BackButton />
        </div>

        <TitlePage title="Extras da Galera" />

        <section className="relative overflow-hidden rounded-2xl border border-azulCinzado bg-azulMedio px-5 py-6 shadow-sm md:px-8 md:py-8">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-verdeNeon/10 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-azulClaroSuave/10 blur-3xl" />

          <div className="relative flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-verdeNeon/35 bg-verdeNeon/10 px-3 py-1 font-inter text-[11px] font-bold tracking-[1.5px] text-verdeNeon">
                DE OLHO NO ADVERSÁRIO
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="font-bebas-neue text-3xl tracking-[2px] text-[#E8EDF5] sm:text-4xl md:text-5xl">
                Palpites extras {selectedPrediction ? `de ${selectedPrediction.full_name}` : ""}
              </h2>
              <p className="max-w-3xl md:max-w-full font-inter text-sm leading-6 text-cinzaSuave md:text-base">
                Hora de analisar a estratégia dos seus concorrentes. Descubra quem eles acham que vai levar a taça e prepare a sua secada!
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {selectedPrediction ? (
            <article
              key={selectedPrediction.user_id}
              className="rounded-2xl border border-verdeNeon/35 bg-azulMedio px-4 py-4 shadow-sm ring-1 ring-verdeNeon/20 sm:px-5 sm:py-5"
            >
              <div className="flex items-start justify-between gap-4 sm:items-center">
                <div className="min-w-0">
                  <p className="truncate font-roboto text-base font-semibold text-[#E8EDF5]">
                    {selectedPrediction.full_name}
                  </p>
                </div>

                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 font-inter text-sm font-bold text-[#E8EDF5]">
                  {selectedPrediction.username.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:mt-5">
                {extraCards.map(({ key, label, icon: Icon, accent, cardClass }) => {
                  const value = selectedPrediction[key];

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-3 ${cardClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={accent} />
                        <span className="font-inter text-[11px] uppercase tracking-[1.4px] text-cinzaSuave">
                          {label}
                        </span>
                      </div>
                      <span className="max-w-[55%] truncate text-right font-roboto text-sm font-semibold text-[#E8EDF5]">
                        {value || "Sem envio"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          ) : (
            <div className="rounded-2xl border border-dashed border-azulCinzado bg-azulMedio px-6 py-10 text-center font-inter text-sm text-cinzaSuave">
              Nenhum palpite extra encontrado para este usuário.
            </div>
          )}
        </section>

        <div className="md:hidden">
          <BackButton
            label="Voltar para o torneio"
            className="w-full justify-center rounded-xl border border-verdeNeon/30 bg-verdeNeon/10 px-5 py-3 font-inter text-sm font-semibold text-verdeNeon hover:bg-verdeNeon/15"
          />
        </div>
      </div>
    </div>
  );
}