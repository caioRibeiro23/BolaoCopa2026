'use client'

type PredictionStatus = "exato" | "combo" | "resultado" |"um_gol" | "incorreto" | "nulo";

export interface ParticipantPrediction {
    id: string;
    name: string;
    initials: string;
    predictionHome: number | null;
    predictionAway: number | null;
    status: PredictionStatus;
    points: number;
}

interface PredictionsTableProps {
    predictions: ParticipantPrediction[];
}

const statusStyles: Record<PredictionStatus, { label: string; className: string }> = {
    exato: {
        label: "Exato",
        className: "bg-verdeNeon/8 text-verdeNeon border-verdeNeon/20",
    },
    resultado: {
        label: "Resultado",
        className: "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/25",
    },
    combo: {
        label: "Combo",
        className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    um_gol: {
        label: "Um Gol",
        className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    incorreto: {
        label: "Incorreto",
        className: "bg-vermelhoVibrante/8 text-vermelhoVibrante border-vermelhoVibrante/20",
    },
    nulo: {
        label: "Nulo",
        className: "bg-cinza/10 text-cinza border-cinza/20",
    }
};

function getPointsLabel(points: number) {
    return `${points === 0 ? "+0" : `+${points}`} pts`;
}

function PredictionStatusBadge({ status }: { status: PredictionStatus }) {
    const style = statusStyles[status];

    return (
        <span className={`inline-flex items-center justify-center rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-[1px] ${style.className}`}>
            {style.label}
        </span>
    );
}

export default function PredictionsTable({ predictions }: PredictionsTableProps) {
    return (
        <div className="flex flex-col rounded-2xl border border-azulCinzado bg-azulMedio shadow-sm overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem_4rem] gap-3 border-b border-cinzaSuave/10 bg-[#FFFFFF]/5 px-5 py-4 text-[11px] font-inter uppercase tracking-[1.5px] text-cinzaSuave md:grid-cols-[minmax(0,2fr)_6.5rem_7rem_5rem]">
                <span>Participante</span>
                <span className="text-center">Palpite</span>
                <span className="text-center">Status</span>
                <span className="text-center">Pontos</span>
            </div>

            {predictions.length > 0 ? (
                predictions.map((prediction, index) => {
                    const isLastRow = index === predictions.length - 1;
                    const hasPrediction = prediction.status !== "nulo"
                        && prediction.predictionHome !== null
                        && prediction.predictionAway !== null;
                    const predictionLabel = hasPrediction
                        ? `${prediction.predictionHome} x ${prediction.predictionAway}`
                        : "-- x --";

                    return (
                        <div
                            key={prediction.id}
                            className={`grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem_4rem] gap-3 px-5 py-3 items-center ${!isLastRow ? "border-b border-cinzaSuave/10" : ""} md:grid-cols-[minmax(0,2fr)_6.5rem_7rem_5rem]`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-[#F59E0B] to-[#EF4444] font-inter text-sm font-bold text-black">
                                    {prediction.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-roboto text-sm font-medium text-[#E8EDF5]">
                                        {prediction.name}
                                    </p>
                                    <p className="hidden md:flex text-[11px] text-cinzaSuave">
                                        Palpite registrado
                                    </p>
                                </div>
                            </div>

                            <div className="text-center font-bebas-neue text-2xl tracking-[2px] text-[#E8EDF5] tabular-nums">
                                {predictionLabel}
                            </div>

                            <div className="flex justify-center">
                                <PredictionStatusBadge status={prediction.status} />
                            </div>

                            <div className="flex flex-col items-center justify-center text-center">
                                <span className={`font-roboto text-base font-bold tabular-nums ${prediction.points === 9 ? "text-verdeNeon" :  "text-cinzaSuave"}`}>
                                    {getPointsLabel(prediction.points)}
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="px-5 py-8 text-center font-inter text-sm text-cinzaSuave">
                    Nenhum palpite foi registrado para esta partida.
                </div>
            )}
        </div>
    );
}