import CardTournament from "@/src/components/Leaderboard/card/cardTournament";
import TitlePage from "@/src/components/ui/titlepage";
import {
  getLeaderboard,
  getUserChampionships,
} from "@/src/lib/supabase/leaderboard";
import { createClient } from "@/src/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ClassificationPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const championshipByUser = await getUserChampionships(user.id);
  const generalLeaderboard = await getLeaderboard();
  const currentUserGeneralPosition =
    generalLeaderboard.find((player) => player.user_id === user.id)?.position ??
    null;

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 bg-azulEscuro px-8 py-16 md:px-14 md:py-17">
      <TitlePage title="Meus Torneios" />

      {/* Ranking Geral */}
      <CardTournament championship={{ championship_name: 'Classificação Geral', position: currentUserGeneralPosition, total_points: null, championship_id: 'general' }} />

      {/* Campeonatos */}
      {championshipByUser.length > 0 ? (
        <div className="flex flex-col gap-4">
          {championshipByUser.map((championship) => (
            <CardTournament key={championship.championship_id} championship={{ championship_name: championship.championship_name, position: championship.position, total_points: championship.total_points, championship_id: championship.championship_id }} />
          ))}
        </div>
      ) : (
        <section className="relative overflow-hidden rounded-3xl border border-azulCinzado bg-linear-to-br from-azulMedio via-azulCinzado to-azulEscuro p-6 shadow-2xl md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-verdeNeon/60 to-transparent" />
          <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-verdeNeon/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-azulClaro/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-verdeNeon/25 bg-verdeNeon/10 px-3 py-1 text-xs font-semibold uppercase tracking-[1.5px] text-verdeNeon">
                Nenhum campeonato encontrado
              </div>

              <div className="space-y-3">
                <h2 className="max-w-xl font-bebas-neue text-4xl tracking-[1.5px] text-white md:text-5xl">
                  Voce ainda nao participa de nenhum torneio
                </h2>

                <p className="max-w-2xl text-sm leading-6 text-cinzaSuave md:text-base">
                  Quando voce entrar em um campeonato, ele aparecera aqui como um card
                  clicavel. Em breve, voce tambem podera criar seu proprio torneio.
                  Se quiser montar um bolao com os amigos antes disso, entre em
                  contato pelo formulario de feedback.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/leaderboard/general"
                  className="inline-flex items-center justify-center rounded-xl border border-verdeNeon/35 bg-verdeNeon/10 px-5 py-3 text-sm font-semibold text-verdeNeon transition-colors duration-200 hover:bg-verdeNeon/15"
                >
                  Ver ranking geral
                </Link>

                <div className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cinzaSuave">
                  Formulario de feedback em breve
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}