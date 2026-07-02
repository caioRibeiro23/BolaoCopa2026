import CardAbertas from "@/src/components/cards/cardAbertas";
import CardAoVivo from "@/src/components/cards/cardAoVivo";
import CardEncerradas, { StatusPontuacao } from "@/src/components/cards/cardEncerradas";
import TitlePage from "@/src/components/ui/titlepage";
import BackButton from "@/src/components/ui/backButton";
import PredictionsTable, { type ParticipantPrediction } from "@/src/components/Tournament/cards/predictionsTable";
import { formatarDataBR } from "@/src/utils/formatar-data";
import { formatarHoraBR } from "@/src/utils/formatar-hora";
import { t } from "@/src/utils/traducaoPaises";
import { getCountryAbbr } from "@/src/components/cards/iconePais/countryAbbr";
import { notFound } from "next/navigation";
import { getMatchById, getMatchParticipantPredictions } from "@/src/lib/supabase/tournament";
import { createClient } from "@/src/lib/supabase/server";

interface MatchPageProps {
    params: Promise<{ matchId: string }> | { matchId: string };
    searchParams?: Promise<{ championshipId?: string }> | { championshipId?: string };
}

function getPhaseLabel(phase: string) {
    switch (phase) {
        case "group_stage":
            return "Fase de Grupos";
        case "last_32":
            return "16 avos";
        case "last_16":
            return "Oitavas de final";
        case "quarter_finals":
            return "Quartas de final";
        case "semi_finals":
            return "Semifinais";
        case "final":
        case "third_place":
            return "Final";
        default:
            return "Partida";
    }
}


function getPredictionStatus(palpiteCasa: number , palpiteVisitante: number, placarCasa: number, placarVisitante: number) {
    let status: StatusPontuacao = "incorreto";
    let points = 0;

    if (palpiteCasa !== undefined && palpiteVisitante !== undefined) {
        const acertouGolCasa = palpiteCasa === placarCasa;
        const acertouGolVisitante = palpiteVisitante === placarVisitante;
        
        const saldoPalpite = palpiteCasa - palpiteVisitante;
        const saldoReal = placarCasa - placarVisitante;
        const acertouVencedor = Math.sign(saldoPalpite) === Math.sign(saldoReal);

        // 🧠 Árvore de Decisão do Front (Espelhando o seu banco de dados)
        if (acertouGolCasa && acertouGolVisitante) {
            status = "exato";
            points = 9;
        } else if (acertouVencedor && (acertouGolCasa || acertouGolVisitante)) {
            status = "combo"; // 5 pontos
            points = 5;
        } else if (acertouVencedor) {
            status = "resultado"; // 3 pontos
            points = 3;
        } else if (acertouGolCasa || acertouGolVisitante) {
            status = "um_gol"; // 1 ponto
            points = 1;
        } else {
            status = "incorreto"; // 0 pontos
            points = 0;
        }
    }
    return { status, points };
}

export default async function MatchPage({ params, searchParams }: MatchPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const match = await getMatchById(resolvedParams.matchId);

    const supabase = await createClient();

    const {
    data: { user },
    } = await supabase.auth.getUser();

    if (!match) {
        notFound();
    }

    const tempoAtualMilissegundos = new Date().getTime();
    
    const obterTimestampGarantido = (dateTimeStr: string) => {
        let isoStr = dateTimeStr.replace(" ", "T");
        if (!isoStr.endsWith("Z") && !isoStr.includes("-03")) {
            isoStr = `${isoStr}Z`;
        }
        return new Date(isoStr).getTime();
    };

    const jogoEstorouHorario = tempoAtualMilissegundos >= obterTimestampGarantido(match.date_time);

    const matchDate = `${formatarDataBR(match.date_time)} - ${formatarHoraBR(match.date_time)}`;
    const groupLabel = match.phase === "group_stage" && match.group_letter 
        ? `Grupo ${match.group_letter.replace('GROUP_', '')}` 
        : getPhaseLabel(match.phase);
    const isFinished = match.status === "finished" && match.goals_home !== null && match.goals_away !== null;
    const isLive = match.status === "live";
    const canSeePredictions = isLive || isFinished || jogoEstorouHorario;
    const participantPredictions: ParticipantPrediction[] = canSeePredictions
        ? (await getMatchParticipantPredictions(match.id, resolvedSearchParams.championshipId)).map((prediction) => {
            // const displayPoints = getDisplayPoints(prediction.points_earned);
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
                status: getPredictionStatus(prediction.prediction_home, prediction.prediction_away, match.goals_home ?? 0, match.goals_away ?? 0).status,
                points: getPredictionStatus(prediction.prediction_home, prediction.prediction_away, match.goals_home ?? 0, match.goals_away ?? 0).points,
            };
        })
        : [];

    const myPrediction = participantPredictions.find((prediction) => prediction.id === user?.id);

    const statusTempo = (match.status === "scheduled" || !isLive) && jogoEstorouHorario
        ? "Aguardando início..."
        : formatarHoraBR(match.date_time);
        
    const resultText = isFinished
        ? `Resultado da Partida: ${getCountryAbbr(t(match.team_home))} ${match.goals_home} x ${match.goals_away} ${getCountryAbbr(t(match.team_away))}`
        : isLive
            ? `Placar ao vivo: ${getCountryAbbr(t(match.team_home))} ${match.goals_home ?? 0} x ${match.goals_away ?? 0} ${getCountryAbbr(t(match.team_away))}`
            : "Resultado da Partida: aguardando início";

    return(
        <div className="w-full px-8 py-12 md:px-14 md:py-14 flex flex-col gap-10 bg-azulEscuro min-h-screen">
            <div className="flex items-start justify-start">
                <BackButton />
            </div>
            <TitlePage title="Detalhes do Jogo" />
            {match.status === "finished" ? (
                <CardEncerradas
                    paisCasa={t(match.team_home)}
                    paisVisitante={t(match.team_away)}
                    grupo={groupLabel}
                    placarCasa={match.goals_home ?? 0}
                    placarVisitante={match.goals_away ?? 0}
                    palpiteCasa={myPrediction?.predictionHome ?? undefined}
                    palpiteVisitante={myPrediction?.predictionAway ?? undefined}
                    phase={match.phase}
                />
            ) : match.status === "live" || jogoEstorouHorario ? (
                <CardAoVivo
                    paisCasa={t(match.team_home)}
                    paisVisitante={t(match.team_away)}
                    grupo={groupLabel}
                    tempo={statusTempo}
                    placarCasa={match.goals_home ?? 0}
                    placarVisitante={match.goals_away ?? 0}
                    palpiteCasa={myPrediction?.predictionHome ?? undefined}
                    palpiteVisitante={myPrediction?.predictionAway ?? undefined}
                    phase={match.phase}
                />
            ) : (
                <CardAbertas
                    paisCasa={t(match.team_home)}
                    paisVisitante={t(match.team_away)}
                    hora={matchDate}
                    grupo={groupLabel}
                    matchId={match.id}
                    date_time={match.date_time}
                    phase={match.phase}
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