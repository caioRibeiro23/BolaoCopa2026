import Link from "next/link";
import TitlePage from "@/src/components/ui/titlepage";
import FullChampionshipTable from "@/src/components/Stats/FullChampionshipTable/fullChampionshipTable";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import { getChampionshipLeaderboard } from "@/src/lib/supabase/leaderboard";
import { formatarDataBR } from "@/src/utils/formatar-data";
import { formatarHoraBR } from "@/src/utils/formatar-hora";
import { t } from "@/src/utils/traducaoPaises";
import CardStats from "@/src/components/Tournament/cards/cardStats";

const CHAMPIONSHIP_ID = "9f949a87-0b94-48ee-ae3d-aa65bd3478da";
const MATCHES_PER_PAGE = 6;

interface MatchRow {
    id: string;
    team_home: string;
    team_away: string;
    date_time: string;
    group_letter: string | null;
    status: "scheduled" | "live" | "finished";
    goals_home: number | null;
    goals_away: number | null;
}

interface TournamentPageProps {
    searchParams?: Promise<{ page?: string | string[] }>;
}

function resolvePageValue(pageValue?: string | string[]) {
    const rawValue = Array.isArray(pageValue) ? pageValue[0] : pageValue;
    const parsedValue = Number.parseInt(rawValue ?? "1", 10);

    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

function getStatusLabel(status: MatchRow["status"]) {
    switch (status) {
        case "live":
            return "AO VIVO";
        case "finished":
            return "ENCERRADA";
        default:
            return "ABERTA";
    }
}

function getStatusClass(status: MatchRow["status"]) {
    switch (status) {
        case "live":
            return "text-[#FF4455] bg-[#FF4455]/10 border-[#FF4455]/20 shadow-[0_0_10px_rgba(255,68,85,0.12)]";
        case "finished":
            return "text-cinzaSuave bg-cinzaSuave/10 border-cinzaSuave/20";
        default:
            return "text-verdeNeon bg-verdeNeon/10 border-verdeNeon/20 shadow-[0_0_10px_rgba(57,255,20,0.08)]";
    }
}

export default async function TournamentPage({ searchParams }: TournamentPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const currentPage = resolvePageValue(resolvedSearchParams.page);
    const offset = (currentPage - 1) * MATCHES_PER_PAGE;

    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const [players, matchesResponse] = await Promise.all([
        getChampionshipLeaderboard(CHAMPIONSHIP_ID),
        supabase
            .from("matches")
            .select(
                "id, team_home, team_away, date_time, group_letter, status, goals_home, goals_away",
                { count: "exact" }
            )
            .order("date_time", { ascending: false })
            .range(offset, offset + MATCHES_PER_PAGE - 1),
    ]);

    const matches = (matchesResponse.data || []) as MatchRow[];
    const totalMatches = matchesResponse.count || 0;
    const totalPages = Math.max(1, Math.ceil(totalMatches / MATCHES_PER_PAGE));
    const leader = players[0];
    const currentUser = players.find((player) => player.user_id === user.id);

    return (
        <div className="w-full px-8 py-16 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro min-h-screen">
            <TitlePage title="Torneio" />

            <section className="overflow-hidden rounded-2xl border border-azulCinzado bg-azulMedio shadow-sm">
                <div className="flex items-center justify-between gap-4 bg-[#FFFFFF]/2 px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-inter tracking-[1.5px] font-bold text-cinzaSuave">
                        <span className="h-2 w-2 rounded-full bg-verdeNeon shadow-[0_0_8px_#39FF14]" />
                        VISÃO GERAL DO CAMPEONATO
                    </div>
                </div>

                <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,16rem)]">
                    <div className="flex flex-col items-start justify-center gap-5">
                        <div className="flex flex-col gap-2">
                            <p className="font-inter text-xs font-bold tracking-[2px] text-verdeNeon">
                                CAMPEONATO PRINCIPAL
                            </p>
                            <h1 className="font-bebas-neue text-4xl tracking-[2px] text-[#E8EDF5] md:text-5xl">
                                Bolão Copa 2026
                            </h1>
                            <p className="max-w-2xl font-inter text-sm leading-6 text-cinzaSuave">
                                Acompanhe a classificação, os destaques do campeonato e a sequência de partidas
                                exibidas abaixo com paginação.
                            </p>
                        </div>
                    </div>

                    <aside className="self-start flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#FFFFFF]/3 py-5 md:w-48 lg:w-52 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 w-full">
                            <div className="flex items-center justify-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700]/10 text-2xl shadow-[0_0_18px_rgba(255,215,0,0.12)]">
                                    🏆
                                </div>
                            </div>

                            <div className="w-full">
                                <p className="font-inter text-xs font-bold tracking-[1.5px] text-cinzaSuave">
                                    LÍDER DO TORNEIO
                                </p>
                                <h2 className="mt-1 font-bebas-neue text-2xl tracking-[1.5px] text-[#E8EDF5]">
                                    {leader?.full_name ?? "Sem líder definido"}
                                </h2>
                            </div>

                            <div className="w-full">
                                <span className="block font-bebas-neue text-4xl tracking-[2px] text-[#FFD700] drop-shadow-[0_0_8px_#FFD700]">
                                    {leader?.total_points ?? 0}
                                </span>
                                <span className="font-inter text-[11px] text-cinzaSuave">pontos</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section>
                <div className="grid gap-3 sm:grid-cols-4">
                    <CardStats titleCard="Participantes" valueCard={players.length} />
                    <CardStats titleCard="Minha posição" valueCard={currentUser ? currentUser.position : "-"} />
                    <CardStats titleCard="Placares Exatos" valueCard={leader?.exact_scores ?? 0} />
                    <CardStats titleCard="Palpites Totais" valueCard={leader?.total_bets ?? 0} />
                </div>
            </section>

            <FullChampionshipTable userId={user.id} />

            <section className="overflow-hidden rounded-2xl border border-azulCinzado bg-azulMedio shadow-sm">
                <div className="flex items-center justify-between gap-4 bg-[#FFFFFF]/2 px-6 py-4">
                    <div>
                        <h2 className="font-bebas-neue text-xl tracking-[1.5px] text-[#E8EDF5]">
                            Partidas
                        </h2>
                        <p className="font-inter text-xs text-cinzaSuave">
                            Clique numa partida para ver os palpites e detalhes da rodada.
                        </p>
                    </div>
                    <span className="font-inter text-xs text-cinzaSuave">
                        Página {currentPage} de {totalPages}
                    </span>
                </div>

                <div className="flex flex-col">
                    {matches.map((match) => {
                        const hasScore = match.goals_home !== null && match.goals_away !== null;
                        const matchDate = formatarDataBR(match.date_time);
                        const matchTime = formatarHoraBR(match.date_time);

                        return (
                            <div
                                key={match.id}
                                className="grid gap-4 border-b border-cinzaSuave/10 px-6 py-4 transition-all duration-150 hover:bg-white/4 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center"
                            >
                                <div className="min-w-0 flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full border px-3 py-1 font-inter text-[11px] font-semibold tracking-[1.5px] ${getStatusClass(match.status)}`}>
                                            {getStatusLabel(match.status)}
                                        </span>
                                        {match.group_letter && (
                                            <span className="font-inter text-xs text-cinzaSuave">
                                                Grupo {match.group_letter}
                                            </span>
                                        )}
                                        <span className="font-inter text-xs text-cinzaSuave">
                                            {matchDate} - {matchTime}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                                        <div className="min-w-0 font-inter text-sm font-bold text-[#E8EDF5]">
                                            <span className="block truncate md:hidden">
                                                {t(match.team_home)} x {t(match.team_away)}
                                            </span>
                                            <span className="hidden truncate md:block">
                                                {t(match.team_home)} x {t(match.team_away)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-[#FFFFFF]/3 px-5 py-5 text-center">
                                    <p className="font-inter text-[11px] uppercase tracking-[1.5px] text-cinzaSuave">
                                        Placar
                                    </p>
                                    <span className="mt-2 block font-bebas-neue text-3xl tracking-[3px] text-[#E8EDF5]">
                                        {hasScore ? `${match.goals_home} : ${match.goals_away}` : "-- : --"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {matches.length === 0 && (
                        <div className="px-6 py-8 text-center font-inter text-sm text-cinzaSuave">
                            Nenhuma partida encontrada nesta página.
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 border-t border-cinzaSuave/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-inter text-xs text-cinzaSuave">
                        Mostrando {matches.length} de {totalMatches} partidas.
                    </p>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/tournament?page=${Math.max(1, currentPage - 1)}`}
                            aria-disabled={currentPage === 1}
                            className={`rounded-lg border px-4 py-2 font-inter text-xs font-bold tracking-[1px] transition-all focus:outline-none focus:ring-2 focus:ring-verdeNeon/20 ${currentPage === 1
                                ? "pointer-events-none border-cinzaSuave/10 bg-white/2 text-cinzaSuave opacity-40"
                                : "border-cinzaSuave/20 bg-white/4 text-cinzaSuave hover:border-verdeNeon/30 hover:text-verdeNeon"
                                }`}
                        >
                            Página anterior
                        </Link>
                        <Link
                            href={`/tournament?page=${Math.min(totalPages, currentPage + 1)}`}
                            aria-disabled={currentPage >= totalPages}
                            className={`rounded-lg border px-4 py-2 font-inter text-xs font-bold tracking-[1px] transition-all focus:outline-none focus:ring-2 focus:ring-verdeNeon/20 ${currentPage >= totalPages
                                ? "pointer-events-none border-cinzaSuave/10 bg-white/2 text-cinzaSuave opacity-40"
                                : "border-verdeNeon/20 bg-verdeNeon/10 text-verdeNeon hover:bg-verdeNeon/15"
                                }`}
                        >
                            Próxima página
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}