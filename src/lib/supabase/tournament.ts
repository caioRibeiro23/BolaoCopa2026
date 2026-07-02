import { createClient } from "./server";

export const MATCH_PHASES = ["all", "group_stage","last_32", "last_16", "quarter_finals", "semi_finals", "final"] as const;

//Vasco

export type MatchPhase = (typeof MATCH_PHASES)[number];

export interface MatchRow {
    id: string;
    team_home: string;
    team_away: string;
    date_time: string;
    group_letter: string | null;
    phase: string;
    status: "scheduled" | "live" | "finished";
    goals_home: number | null;
    goals_away: number | null;
}

export interface MatchBetRow {
    user_id: string;
    prediction_home: number;
    prediction_away: number;
    points_earned: number | null;
}

export interface MatchParticipantPrediction extends MatchBetRow {
    full_name: string;
    username: string;
}

export function resolvePageValue(pageValue?: string | string[]) {
    const rawValue = Array.isArray(pageValue) ? pageValue[0] : pageValue;
    const parsedValue = Number.parseInt(rawValue ?? "1", 10);

    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

export function resolvePhaseValue(phaseValue?: string | string[]): MatchPhase {
    const rawValue = Array.isArray(phaseValue) ? phaseValue[0] : phaseValue;

    return MATCH_PHASES.includes(rawValue as MatchPhase) ? (rawValue as MatchPhase) : "all";
}

export function getDefaultPageForMatches(matches: MatchRow[], pageSize: number) {
    const latestFinishedIndex = matches.reduce<number | null>((latestIndex, match, currentIndex) => {
        if (match.status !== "finished") {
            return latestIndex;
        }

        if (latestIndex === null) {
            return currentIndex;
        }

        const latestMatch = matches[latestIndex];
        return new Date(match.date_time).getTime() >= new Date(latestMatch.date_time).getTime()
            ? currentIndex
            : latestIndex;
    }, null);

    if (latestFinishedIndex === null) {
        return 1;
    }

    return Math.floor(latestFinishedIndex / pageSize) + 1;
}

export async function getTournamentMatches() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("matches")
        .select("id, team_home, team_away, date_time, group_letter, phase, status, goals_home, goals_away")
        .order("date_time", { ascending: true });

    if (error) {
        console.error("Erro ao carregar partidas do torneio:", error.message);
        return [];
    }

    return (data || []) as MatchRow[];
}

export async function getMatchById(matchId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("matches")
        .select("id, team_home, team_away, date_time, group_letter, phase, status, goals_home, goals_away")
        .eq("id", matchId)
        .maybeSingle();

    if (error) {
        console.error("Erro ao carregar a partida:", error.message);
        return null;
    }

    return data as MatchRow | null;
}

export async function getMatchParticipantPredictions(matchId: string, championshipId?: string) {
    const supabase = await createClient();

    let memberUserIds: string[] | null = null;

    if (championshipId && championshipId !== "general") {
        const { data: membersData, error: membersError } = await supabase
            .from("championship_members")
            .select("user_id")
            .eq("championship_id", championshipId);

        if (membersError) {
            console.error("Erro ao carregar participantes do torneio:", membersError.message);
            return [];
        }

        memberUserIds = (membersData || []).map((member) => member.user_id);

        if (memberUserIds.length === 0) {
            return [];
        }
    }

    let betsQuery = supabase
        .from("bets")
        .select("user_id, prediction_home, prediction_away, points_earned")
        .eq("match_id", matchId);

    if (memberUserIds) {
        betsQuery = betsQuery.in("user_id", memberUserIds);
    }

    const { data: betsData, error: betsError } = await betsQuery.order("points_earned", { ascending: false });

    if (betsError) {
        console.error("Erro ao carregar palpites da partida:", betsError.message);
        return [];
    }

    const bets = (betsData || []) as MatchBetRow[];

    if (bets.length === 0) {
        return [];
    }

    const userIds = Array.from(new Set(bets.map((bet) => bet.user_id)));

    const { data: profilesData, error: profilesError } = await supabase
        .from("user_profiles")
        .select("id, full_name, username")
        .in("id", userIds);

    if (profilesError) {
        console.error("Erro ao carregar perfis dos participantes:", profilesError.message);
        return bets.map((bet) => ({
            ...bet,
            full_name: "Participante",
            username: "participante",
        }));
    }

    const profilesById = new Map(
        (profilesData || []).map((profile) => [profile.id, profile])
    );

    return bets.map((bet) => {
        const profile = profilesById.get(bet.user_id);

        return {
            ...bet,
            full_name: profile?.full_name ?? "Participante",
            username: profile?.username ?? "participante",
        };
    }) as MatchParticipantPrediction[];
}