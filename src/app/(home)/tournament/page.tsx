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
import GeneralTable from "@/src/components/Stats/GeneralTable/generalTable";
import ChampionshipTable from "@/src/components/Stats/ChampionshipTable/championshipTable";

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
    let currentUser = players.find((player) => player.user_id === user.id);

    const MASTER_USER_ID = "2709dba4-7bac-4625-bbda-bbaa64bf3c32"; 

    const hasSpecialAccess = user.id === MASTER_USER_ID;


    // Se ele tiver o acesso especial, simulamos o objeto do usuário para a página renderizar sem quebrar
    if (!currentUser && hasSpecialAccess) {
        currentUser = {
            user_id: user.id,
            username: "Admin/Viewer",
            full_name: "Visualizador Convidado",
            avatar_url: null,
            total_points: 0,
            exact_scores: 0,
            correct_results: 0,
            total_bets: 0,
            position: 0 // Não ganha rank oficial por estar fora da liga
        };
    }

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
        <div className="w-full px-6 py-12 md:px-14 md:py-14 flex flex-col gap-10 bg-azulEscuro min-h-screen">
            <TitlePage title="Torneio" />

            <HeaderTournamentSection leader={leader} tournamentName={tournamentName} />

            <section>
                <div className="grid gap-3 md:grid-cols-4">
                    <CardStats titleCard="Participantes" valueCard={players.length} />
                    <CardStats titleCard="Minha posição" valueCard={currentUser ? currentUser.position : "-"} />
                    <CardStats titleCard="Placares Exatos" valueCard={leader?.exact_scores ?? 0} />
                    <CardStats titleCard="Palpites Totais" valueCard={leader?.total_bets ?? 0} />
                </div>
            </section>

            {isGeneralChampionship ? (
    <GeneralTable userId={user.id} championshipId={championshipId} currentPage={pageFromQuery} />
) : (
    <ChampionshipTable userId={user.id} championshipId={championshipId} currentPage={pageFromQuery} hasSpecialAccess={hasSpecialAccess} />
)}
            
            {isGeneralChampionship ? (
                <div className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-8 text-center">
                    <h3 className="font-bebas-neue text-2xl text-white mb-3">
                        🔒 Palpites Exclusivos da Liga Premiada
                    </h3>

                    <p className="font-inter text-sm text-cinzaSuave mb-4">
                        Os palpites dos participantes ficam disponíveis apenas na Liga
                        Premiada. Se você já participa da Liga Premiada, basta acessar a
                        classificação da liga para acompanhar os palpites e o desempenho dos
                        concorrentes ao longo da Copa.
                    </p>

                    <a
                        href="/tournament?championshipId=9f949a87-0b94-48ee-ae3d-aa65bd3478da"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-verdeNeon bg-azulEscuro/20 px-5 py-2 text-center font-inter text-sm font-semibold text-verdeNeon transition-all duration-200 hover:scale-105 hover:bg-azulEscuro/60 hover:brightness-105 md:w-auto md:text-base"
                    >
                        Classificação da Liga Premiada
                    </a>

                    <p className="font-inter text-sm text-cinzaSuave mt-8 mb-6">
                        Ainda não faz parte? As inscrições continuam abertas e você ainda pode
                        garantir sua participação para disputar as premiações.
                    </p>

                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdaUDdA5kN_MStkDsNWx3zcxpAlAO1UJoO0Ltxv2qR7j7wkgA/viewform?usp=dialog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-lg border border-[#FFD700]/40 bg-[#FFD700] px-5 py-2 text-center font-inter text-sm font-semibold text-[#1A1300] shadow-[0_0_10px_rgba(255,215,0,0.18)] transition-all duration-200 hover:scale-105 hover:brightness-95 md:w-auto md:text-base"
                    >
                        Participar da Liga Premiada
                    </a>
                </div>
            ) : (
                <MatchesSection
                    matches={allMatches}
                    initialPage={initialPage}
                    currentPhase={currentPhase}
                    championshipId={championshipId}
                />
            )}
            
        </div>
    );
}