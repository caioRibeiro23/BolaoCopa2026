import { createClient } from "./server";

export const MATCH_PHASES = ["all", "groups", "round_16", "quarterfinals", "semifinals", "final"] as const;

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