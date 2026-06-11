import { getCountryAbbr } from "../../cards/iconePais/countryAbbr";
import HistoryResultCard from "../../ui/historyResultCard";

interface MatchWithBet {
    id: string;
    team_home: string;
    team_away: string;
    goals_home: number | null;
    goals_away: number | null;
    date_time?: string;
    group_letter: string | null;
    bets: {
        prediction_home: number;
        prediction_away: number;
        points_earned: number | null;
    }[];
}
interface HistoryRowProps {
    status: "exato" | "resultado" | "errado" | "nulo" | "combo" | "um_gol" | "incorreto";
    match: MatchWithBet;
}

export default function historyRow({ status, match }: HistoryRowProps) {
    const palpite = match.bets && match.bets.length > 0 ? match.bets[0] : null;
    
    let dataFormatada = "";
    if (match.date_time) {
        const dataJogo = new Date(match.date_time);
        const dia = dataJogo.toLocaleDateString("pt-BR", { day: "2-digit" });
        const mes = dataJogo.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
        
        dataFormatada = `${dia} ${mes}`; // Junta os dois com um espaço simples
    }
    const infoPartida = match.group_letter 
        ? `Grupo ${match.group_letter} - ${dataFormatada}`
        : dataFormatada;
    return(
        <div className="w-full grid grid-cols-[minmax(0,1fr)_4.5rem_5.5rem] md:grid-cols-[minmax(0,1fr)_6rem_7rem] px-3 md:px-5 py-2.5 gap-2 md:gap-4 items-center border-b border-cinzaSuave/10">
            <div className="min-w-0 flex flex-col py-0.5 font-inter">
                <p className="font-bold text-sm text-[#E8EDF5] md:hidden">{getCountryAbbr(match.team_home)} vs {getCountryAbbr(match.team_away)}</p>
                <p className="font-bold text-sm text-[#E8EDF5] hidden md:flex">{match.team_home} vs {match.team_away}</p>
                <span className="text-xs text-cinzaSuave">{infoPartida}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 w-full gap-0.5 md:gap-1">
                <p className="font-inter text-[10px] md:text-xs text-cinzaSuave">Seu palpite</p>
                <span className="font-bold text-sm md:text-base text-[#E8EDF5]">{palpite?.prediction_home} : {palpite?.prediction_away}</span>
                <p className="font-inter text-[10px] md:text-xs text-cinzaSuave">Final: {match.goals_home} : {match.goals_away}</p>
            </div>
            <div className="w-full flex justify-center items-center">
                <HistoryResultCard status={status} />
            </div>
        </div>
    )
}