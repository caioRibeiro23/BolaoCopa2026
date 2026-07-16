"use server";

import { createClient } from "./server";

export interface ExtraPrediction {
    user_id: string;
    champion_team: string | null;
    runner_up_team: string | null;
    top_scorer: string | null;
    updated_at: string | null;
}

export interface ExtraPredictionWithUser extends ExtraPrediction {
    full_name: string;
    username: string;
    avatar_url: string | null;
}

interface SaveExtraPredictionParams {
  championTeam: string;
  runnerUpTeam: string;
  topScorer: string;
}

export async function saveExtraPrediction({
  championTeam,
  runnerUpTeam,
  topScorer,
}: SaveExtraPredictionParams) {
  const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Usuário não autenticado");
    }

    const DEADLINE = new Date("2026-06-18T00:00:00-03:00");

    if (new Date() >= DEADLINE) {
        throw new Error(
            "O prazo para envio dos palpites extras foi encerrado."
        );
    }

    const { error } = await supabase
        .from("extra_predictions")
        .upsert(
        {
            user_id: user.id,
            champion_team: championTeam,
            runner_up_team: runnerUpTeam,
            top_scorer: topScorer,
            updated_at: new Date().toISOString(),
        },
        {
            onConflict: "user_id",
        }
        );

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function getExtraPrediction() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
        .from("extra_predictions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

export async function getExtraPredictionsWithUsers(userId?: string): Promise<ExtraPredictionWithUser[]> {
    const supabase = await createClient();

    let extraPredictionsQuery = supabase
        .from("extra_predictions")
        .select("user_id, champion_team, runner_up_team, top_scorer, updated_at");

    if (userId) {
        extraPredictionsQuery = extraPredictionsQuery.eq("user_id", userId);
    }

    const { data: extraPredictions, error: extraPredictionsError } = await extraPredictionsQuery;

    if (extraPredictionsError) {
        throw extraPredictionsError;
    }

    const userIds = Array.from(
        new Set((extraPredictions || []).map((prediction) => prediction.user_id))
    );

    const { data: userProfiles, error: userProfilesError } = await supabase
        .from("user_profiles")
        .select("id, full_name, username, avatar_url")
        .in("id", userIds);

    if (userProfilesError) {
        throw userProfilesError;
    }

    const userProfilesById = new Map(
        (userProfiles || []).map((profile) => [profile.id, profile])
    );

    return (extraPredictions || []).map((prediction) => {
        const profile = userProfilesById.get(prediction.user_id);

        return {
            ...prediction,
            full_name: profile?.full_name || "Participante",
            username: profile?.username || "US",
            avatar_url: profile?.avatar_url ?? null,
        };
    }) as ExtraPredictionWithUser[];
}