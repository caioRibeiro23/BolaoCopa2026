import TitlePage from "@/src/components/ui/titlepage";
import FullChampionshipTable from "@/src/components/Stats/FullChampionshipTable/fullChampionshipTable";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    getChampionshipLeaderboard,
    getChampionshipName,
    getLeaderboard,
} from "@/src/lib/supabase/leaderboard";
import CardStats from "@/src/components/Tournament/cards/cardStats";
import MatchesSection from "@/src/components/Tournament/matchesSection";
import HeaderTournamentSection from "@/src/components/Tournament/headerSection";
import {
    getDefaultPageForMatches,
    getTournamentMatches,
    resolvePageValue,
    resolvePhaseValue,
} from "@/src/lib/supabase/tournament";
import FullGeneralTable from "@/src/components/Stats/FullGeneralTable/fullGeneralTable";

// const CHAMPIONSHIP_ID = "9f949a87-0b94-48ee-ae3d-aa65bd3478da";

const MATCHES_PER_PAGE = 6;

type TournamentSearchParams = {
    page?: string | string[];
    phase?: string | string[];
    championshipId?: string;
};

interface TournamentPageProps {
    searchParams?: Promise<TournamentSearchParams>;
}

export default async function TournamentPage({ searchParams }: TournamentPageProps) {
    const resolvedSearchParams: TournamentSearchParams = searchParams ? await searchParams : {};
    const pageFromQuery = resolvePageValue(resolvedSearchParams.page);
    const currentPhase = resolvePhaseValue(resolvedSearchParams.phase);
    const championshipId = resolvedSearchParams.championshipId;
    const isGeneralChampionship = championshipId === "general";
    
    if (!championshipId) {
        redirect("/");
    }

    const tournamentName = isGeneralChampionship
        ? "Classificação Geral"
        : (await getChampionshipName(championshipId)) ?? "Bolão Copa 2026";

    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const players = isGeneralChampionship
        ? await getLeaderboard()
        : await getChampionshipLeaderboard(championshipId);
    const currentUser = players.find((player) => player.user_id === user.id);

    if (!currentUser) {
        redirect("/");
    }

    const allMatches = await getTournamentMatches();
    const phaseMatches = currentPhase === "all"
        ? allMatches
        : allMatches.filter((match) => match.phase === currentPhase);
    const defaultInitialPage = getDefaultPageForMatches(phaseMatches, MATCHES_PER_PAGE);
    const initialPage = resolvedSearchParams.page ? pageFromQuery : defaultInitialPage;
    const leader = players[0];

    return (
        <div className="w-full px-8 py-12 md:px-14 md:py-14 flex flex-col gap-10 bg-azulEscuro min-h-screen">
            <TitlePage title="Torneio" />

            <HeaderTournamentSection leader={leader} tournamentName={tournamentName} />

            <section>
                <div className="grid gap-3 sm:grid-cols-4">
                    <CardStats titleCard="Participantes" valueCard={players.length} />
                    <CardStats titleCard="Minha posição" valueCard={currentUser ? currentUser.position : "-"} />
                    <CardStats titleCard="Placares Exatos" valueCard={leader?.exact_scores ?? 0} />
                    <CardStats titleCard="Palpites Totais" valueCard={leader?.total_bets ?? 0} />
                </div>
            </section>

            {isGeneralChampionship ? <FullGeneralTable userId={user.id} /> : <FullChampionshipTable userId={user.id} />}
            
            <MatchesSection
                matches={allMatches}
                initialPage={initialPage}
                currentPhase={currentPhase}
            />
        </div>
    );
}