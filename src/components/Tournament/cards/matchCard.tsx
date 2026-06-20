import Link from "next/link";
import Flag from "../../cards/iconePais/flag";
import { formatarDataBR } from "@/src/utils/formatar-data";
import { formatarHoraBR } from "@/src/utils/formatar-hora";
import { getCountryAbbr } from "../../cards/iconePais/countryAbbr";

interface MatchCardProps {
    matchId: string;
    championshipId?: string;
    paisCasa: string;
    paisVisitante: string;
    placarCasa: number | null;
    placarVisitante: number | null;
    grupo: string;
    status: "scheduled" | "live" | "finished";
    dateTime: string;
}

function getStatusLabel(status: MatchCardProps["status"]) {
    switch (status) {
        case "live":
            return "AO VIVO";
        case "finished":
            return "ENCERRADA";
        default:
            return "ABERTA";
    }
}

function getStatusClass(status: MatchCardProps["status"]) {
    switch (status) {
        case "live":
            return "text-[#FF4455] bg-[#FF4455]/10 border-[#FF4455]/20 shadow-[0_0_10px_rgba(255,68,85,0.12)]";
        case "finished":
            return "text-cinzaSuave bg-cinzaSuave/10 border-cinzaSuave/20";
        default:
            return "text-verdeNeon bg-verdeNeon/10 border-verdeNeon/20 shadow-[0_0_10px_rgba(57,255,20,0.08)]";
    }
}

export default function MatchCard({ matchId, championshipId, paisCasa, paisVisitante, placarCasa, placarVisitante, grupo, status, dateTime }: MatchCardProps) {
    const hasScore = placarCasa !== null && placarVisitante !== null;
    const data = formatarDataBR(dateTime);
    const hora = formatarHoraBR(dateTime);
    const href = championshipId ? `/torneio/matches/${matchId}?championshipId=${championshipId}` : `/torneio/matches/${matchId}`;

    return (
        <Link
            href={href}
            aria-label={`Ver palpites dos participantes da partida entre ${paisCasa} e ${paisVisitante}`}
            className="group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-verdeNeon/30"
        >
            <article className="flex flex-col gap-5 rounded-2xl border border-azulCinzado bg-azulMedio p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-verdeNeon/20 hover:shadow-[0_0_18px_rgba(57,255,20,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-cinzaSuave font-inter text-xs uppercase">
                    <span>{grupo}</span>
                    <span className={`rounded-lg border px-3 py-2 ${getStatusClass(status)}`}>{getStatusLabel(status)}</span>
                </div>

                <div className="flex items-center justify-between gap-4 font-bold text-sm text-[#E8EDF5]">
                    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
                        <Flag country={paisCasa} />
                        <div className="truncate hidden md:flex">{paisCasa}</div>
                        <span className="text-[11px] font-inter text-cinzaSuave md:hidden">{getCountryAbbr(paisCasa)}</span>
                    </div>

                    <div className="flex min-w-24 flex-col items-center gap-2">
                        <span className="font-bebas-neue text-4xl tracking-[3px] text-[#E8EDF5]">
                            {hasScore ? `${placarCasa} x ${placarVisitante}` : "-- x --"}
                        </span>
                        <span className="font-inter text-[11px] uppercase tracking-[1.5px] text-cinzaSuave">
                            {data} • {hora}
                        </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
                        <Flag country={paisVisitante} />
                        <div className="truncate hidden md:flex">{paisVisitante}</div>
                        <span className="text-[11px] font-inter text-cinzaSuave md:hidden">{getCountryAbbr(paisVisitante)}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 text-xs font-inter text-cinzaSuave">
                    <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    <span className="inline-flex items-center gap-2 font-bold text-verdeNeon bp-840:opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
                        Ver palpites dos participantes
                        <span aria-hidden="true">→</span>
                    </span>
                </div>
            </article>
        </Link>
    )
}