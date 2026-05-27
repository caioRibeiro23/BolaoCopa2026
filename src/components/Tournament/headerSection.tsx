interface HeaderTournamentSectionProps {
    leader: {
        full_name: string;
        total_points: number;
    } | null,
    tournamentName: string;
}

export default function HeaderTournamentSection({ leader, tournamentName }: HeaderTournamentSectionProps) {
    return(
        <section className="overflow-hidden rounded-2xl border border-azulCinzado bg-azulMedio shadow-sm">
            <div className="flex items-center justify-between gap-4 bg-[#FFFFFF]/2 px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-inter tracking-[1.5px] font-bold text-cinzaSuave">
                    <span className="h-2 w-2 rounded-full bg-verdeNeon shadow-[0_0_8px_#39FF14]" />
                    VISÃO GERAL DO CAMPEONATO
                </div>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,16rem)]">
                <div className="flex flex-col items-start justify-center gap-5">
                    <div className="flex flex-col gap-2">
                        <p className="font-inter text-xs font-bold tracking-[2px] text-verdeNeon">
                            CAMPEONATO PRINCIPAL
                        </p>
                        <h1 className="font-bebas-neue text-4xl tracking-[2px] text-[#E8EDF5] md:text-5xl">
                            {tournamentName}
                        </h1>
                        <p className="max-w-2xl font-inter text-sm leading-6 text-cinzaSuave">
                            Acompanhe a classificação, os destaques do campeonato e a sequência de partidas
                            exibidas abaixo com paginação.
                        </p>
                    </div>
                </div>

                <aside className="self-start flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#FFFFFF]/3 py-5 md:w-48 lg:w-52 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                        <div className="flex items-center justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700]/10 text-2xl shadow-[0_0_18px_rgba(255,215,0,0.12)]">
                                🏆
                            </div>
                        </div>

                        <div className="w-full">
                            <p className="font-inter text-xs font-bold tracking-[1.5px] text-cinzaSuave">
                                LÍDER DO TORNEIO
                            </p>
                            <h2 className="mt-1 font-bebas-neue text-2xl tracking-[1.5px] text-[#E8EDF5]">
                                {leader?.full_name ?? "Sem líder definido"}
                            </h2>
                        </div>

                        <div className="w-full">
                            <span className="block font-bebas-neue text-4xl tracking-[2px] text-[#FFD700] drop-shadow-[0_0_8px_#FFD700]">
                                {leader?.total_points ?? 0}
                            </span>
                            <span className="font-inter text-[11px] text-cinzaSuave">pontos</span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}