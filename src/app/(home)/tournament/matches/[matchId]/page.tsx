import CardAbertas from "@/src/components/cards/cardAbertas";
import CardAoVivo from "@/src/components/cards/cardAoVivo";
import CardEncerradas from "@/src/components/cards/cardEncerradas";
import TitlePage from "@/src/components/ui/titlepage";
import PredictionsTable, { type ParticipantPrediction } from "@/src/components/Tournament/cards/predictionsTable";
import { formatarDataBR } from "@/src/utils/formatar-data";
import { formatarHoraBR } from "@/src/utils/formatar-hora";
import { t } from "@/src/utils/traducaoPaises";
import { getCountryAbbr } from "@/src/components/cards/iconePais/countryAbbr";
import { notFound } from "next/navigation";
import { getMatchById, getMatchParticipantPredictions } from "@/src/lib/supabase/tournament";

interface MatchPageProps {
    params: Promise<{ matchId: string }> | { matchId: string };
}

function getPhaseLabel(phase: string) {
    switch (phase) {
        case "groups":
            return "Grupo";
        case "round_16":
            return "Oitavas de final";
        case "quarterfinals":
            return "Quartas de final";
        case "semifinals":
            return "Semifinais";
        case "final":
            return "Final";
        default:
            return "Partida";
    }
}

function getDisplayPoints(points: number | null) {
    if (points === null || points === undefined) {
        return 0;
    }

    if (points >= 10) {
        return 3;
    }

    if (points >= 5) {
        return 1;
    }

    return points;
}

function getPredictionStatus(points: number | null): "exato" | "resultado" | "nulo" {
    const displayPoints = getDisplayPoints(points);

    if (displayPoints >= 3) {
        return "exato";
    }

    if (displayPoints >= 1) {
        return "resultado";
    }

    return "nulo";
}

export default async function MatchPage({ params }: MatchPageProps) {
    const resolvedParams = await params;
    const match = await getMatchById(resolvedParams.matchId);

    if (!match) {
        notFound();
    }

    const matchDate = `${formatarDataBR(match.date_time)} - ${formatarHoraBR(match.date_time)}`;
    const groupLabel = match.group_letter ? `Grupo ${match.group_letter}` : getPhaseLabel(match.phase);
    const isFinished = match.status === "finished" && match.goals_home !== null && match.goals_away !== null;
    const isLive = match.status === "live";
    const canSeePredictions = isLive || isFinished;
    const participantPredictions: ParticipantPrediction[] = canSeePredictions
        ? (await getMatchParticipantPredictions(match.id)).map((prediction) => {
            const displayPoints = getDisplayPoints(prediction.points_earned);
            const nameParts = prediction.full_name.trim().split(/\s+/).filter(Boolean);
            const initials = nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                : prediction.username.slice(0, 2).toUpperCase();

            return {
                id: prediction.user_id,
                name: prediction.full_name,
                initials,
                predictionHome: prediction.prediction_home,
                predictionAway: prediction.prediction_away,
                status: getPredictionStatus(prediction.points_earned),
                points: displayPoints,
            };
        })
        : [];
    const resultText = isFinished
        ? `Resultado da Partida: ${getCountryAbbr(t(match.team_home))} ${match.goals_home} x ${match.goals_away} ${getCountryAbbr(t(match.team_away))}`
        : isLive
            ? `Placar ao vivo: ${getCountryAbbr(t(match.team_home))} ${match.goals_home ?? 0} x ${match.goals_away ?? 0} ${getCountryAbbr(t(match.team_away))}`
            : "Resultado da Partida: aguardando início";

    return(
        <div className="w-full px-8 py-12 md:px-14 md:py-14 flex flex-col gap-10 bg-azulEscuro min-h-screen">
            <TitlePage title="Detalhes do Jogo" />
            {match.status === "finished" ? (
                <CardEncerradas
                    paisCasa={t(match.team_home)}
                    paisVisitante={t(match.team_away)}
                    grupo={groupLabel}
                    placarCasa={match.goals_home ?? 0}
                    placarVisitante={match.goals_away ?? 0}
                />
            ) : match.status === "live" ? (
                <CardAoVivo
                    paisCasa={t(match.team_home)}
                    paisVisitante={t(match.team_away)}
                    grupo={groupLabel}
                    tempo={formatarHoraBR(match.date_time)}
                    placarCasa={match.goals_home ?? 0}
                    placarVisitante={match.goals_away ?? 0}
                />
            ) : (
                <CardAbertas
                    paisCasa={t(match.team_home)}
                    paisVisitante={t(match.team_away)}
                    hora={matchDate}
                    grupo={groupLabel}
                    matchId={match.id}
                    date_time={match.date_time}
                />
            )}
            {canSeePredictions ? (
                <>
                    <div className="flex w-full items-center justify-between">
                        <h2 className="border-l-4 border-verdeNeon pl-4 font-bebas-neue text-2xl md:text-3xl text-white">Palpites dos Participantes</h2>
                        <p className="text-cinzaSuave font-inter text-xs font-bold uppercase">{resultText}</p>
                    </div>
                    <PredictionsTable predictions={participantPredictions} />
                </>
            ) : (
                <div className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-8 text-center font-inter text-sm text-cinzaSuave">
                    Os palpites dos participantes ficam visíveis apenas quando a partida estiver ao vivo ou encerrada.
                </div>
            )}
        </div>
    )
}