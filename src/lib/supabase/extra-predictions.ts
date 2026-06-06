"use server";

import { createClient } from "./server";

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