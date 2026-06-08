import CardTournament from "@/src/components/Leaderboard/card/cardTournament";
import TitlePage from "@/src/components/ui/titlepage";
import {
  getLeaderboard,
  getUserChampionships,
} from "@/src/lib/supabase/leaderboard";
import { createClient } from "@/src/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MYTournamentsPage() {
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
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-amarelo/10 blur-3xl" />

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amarelo/30 bg-amarelo/10 px-3 py-1 text-xs font-semibold uppercase tracking-[1.5px] text-amarelo">
              Liga Premiada
            </div>

            <div className="space-y-3">
              <h2 className="max-w-3xl font-bebas-neue text-4xl tracking-[1.5px] text-white md:text-5xl">
                Ainda não participa de nenhum torneio?
              </h2>

              <p className="max-w-2xl text-sm leading-6 text-cinzaSuave md:text-base">
                As inscrições para a Liga Premiada estão abertas! Com uma
                entrada única de <strong>R$ 15</strong>, você concorre a uma
                premiação que pode chegar a até{" "}
                <strong>R$ 10 × o número de participantes</strong>.
              </p>

              <p className="max-w-2xl text-sm leading-6 text-cinzaSuave md:text-base">
                Para participar, basta preencher o formulário de inscrição e
                enviar seu comprovante de pagamento.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-amarelo/20 bg-amarelo/5 p-4">
                <p className="text-sm font-semibold text-amarelo">
                  💰 Entrada única
                </p>
                <p className="mt-1 text-cinzaSuave">
                  Apenas R$ 15 para participar da Liga Premiada.
                </p>
              </div>

              <div className="rounded-xl border border-verdeNeon/20 bg-verdeNeon/5 p-4">
                <p className="text-sm font-semibold text-verdeNeon">
                  🏆 Premiação
                </p>
                <p className="mt-1 text-cinzaSuave">
                  Até R$ 10 multiplicado pelo total de participantes.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amarelo/20 bg-amarelo/5 p-4">
              <p className="font-semibold text-amarelo">
                ⏰ Inscrições abertas até sábado, dia 13
              </p>
              <p className="mt-1 text-sm text-cinzaSuave">
                Garanta sua vaga antes do encerramento das inscrições.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://forms.gle/6drStjfACv2wGtEcA"
                target="_blank"
                className="inline-flex items-center justify-center rounded-xl bg-verdeNeon px-6 py-3 text-sm font-bold text-azulEscuro transition hover:opacity-90"
              >
                Participar da Liga Premiada
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}