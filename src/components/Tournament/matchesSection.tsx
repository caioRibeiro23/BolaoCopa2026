"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import FilterCard from "./cards/filterCard"
import MatchCard from "./cards/matchCard"
import PaginationCard from "./cards/paginationCard"
import { t } from "@/src/utils/traducaoPaises";

interface MatchRow {
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

interface MatchesSectionProps {
    matches: MatchRow[];
    initialPage: number;
    currentPhase: "all" | "groups" | "round_16" | "quarterfinals" | "semifinals" | "final";
}

const phaseFilters = [
    { text: "Todas as partidas", value: "all" },
    { text: "Fase de grupos", value: "groups" },
    { text: "Oitavas de final", value: "round_16" },
    { text: "Quartas de final", value: "quarterfinals" },
    { text: "Semifinais", value: "semifinals" },
    { text: "Final", value: "final" },
] as const;

function getPhaseLabel(phase: MatchRow["phase"]) {
    switch (phase) {
        case "groups":
            return "Fase de grupos";
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

function getPaginationItems(totalPages: number, currentPage: number) {
    if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 3));
    const endPage = Math.min(totalPages, startPage + 3);
    const items: Array<number | "ellipsis"> = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    if (startPage > 1) {
        items.unshift("ellipsis");
    }

    if (endPage < totalPages) {
        items.push("ellipsis");
    }

    return items;
}

export default function MatchesSection({ matches, initialPage, currentPhase }: MatchesSectionProps) {
    const [selectedPhase, setSelectedPhase] = useState(currentPhase);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setSelectedPhase(currentPhase);
    }, [currentPhase]);

    const filteredMatches = useMemo(() => {
        if (selectedPhase === "all") {
            return matches;
        }

        return matches.filter((match) => match.phase === selectedPhase);
    }, [matches, selectedPhase]);

    const totalMatches = filteredMatches.length;
    const totalPages = Math.max(1, Math.ceil(totalMatches / 6));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setCurrentPage(1);
    }, [selectedPhase]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginationItems = getPaginationItems(totalPages, currentPage);
    const visibleMatches = filteredMatches.slice((currentPage - 1) * 6, currentPage * 6);

    return(
        <section className="flex flex-col w-full gap-6">
            <div className="flex w-full items-center justify-between">
                <h2 className="border-l-4 border-verdeNeon pl-4 font-bebas-neue text-2xl md:text-3xl text-white">Partidas</h2>
                <p className="text-cinzaSuave font-inter text-xs font-bold w-24 md:w-fit md:uppercase">Clique numa partida para ver os palpites</p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex w-full flex-wrap items-center gap-3">
                    {phaseFilters.map((filter) => (
                        <FilterCard
                            key={filter.value}
                            text={filter.text}
                            isActive={selectedPhase === filter.value}
                            onClick={() => setSelectedPhase(filter.value)}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-azulCinzado bg-azulMedio px-5 py-4 font-inter text-xs text-cinzaSuave">
                    <span>
                        Mostrando {visibleMatches.length} de {totalMatches} partidas
                    </span>
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {visibleMatches.map((match) => (
                        <MatchCard
                            key={match.id}
                            matchId={match.id}
                            paisCasa={t(match.team_home)}
                            paisVisitante={t(match.team_away)}
                            placarCasa={match.goals_home}
                            placarVisitante={match.goals_away}
                            grupo={match.group_letter ? `Grupo ${match.group_letter}` : getPhaseLabel(match.phase)}
                            status={match.status}
                            dateTime={match.date_time}
                        />
                    ))}

                    {visibleMatches.length === 0 && (
                        <div className="rounded-2xl border border-azulCinzado bg-azulMedio px-6 py-8 text-center font-inter text-sm text-cinzaSuave md:col-span-2 lg:col-span-3">
                            Nenhuma partida encontrada para este filtro.
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-center w-full gap-2">
                <PaginationCard
                    number={"<"}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                />

                {paginationItems.map((item, index) =>
                    item === "ellipsis" ? (
                        <PaginationCard key={`ellipsis-${index}`} number="..." isEllipsis />
                    ) : (
                        <PaginationCard
                            key={item}
                            number={item}
                            isActive={item === currentPage}
                            onClick={() => setCurrentPage(item)}
                        />
                    )
                )}

                <PaginationCard
                    number={">"}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                />
            </div>
        </section>
    )
}