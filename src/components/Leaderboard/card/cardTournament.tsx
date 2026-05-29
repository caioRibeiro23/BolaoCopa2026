import Link from "next/link";

interface CardTournamentProps {
    championship: {
        championship_id: string;
        championship_name: string;
        position: number | null;
        total_points: number | null;
    };
}

export default function CardTournament({ championship }: CardTournamentProps) {
    return (
        <Link
            key={championship.championship_id}
            href={`/tournament?championshipId=${championship.championship_id}`}
            className="group relative overflow-hidden rounded-2xl border border-azulCinzado bg-linear-to-br from-azulMedio via-azulCinzado to-azulEscuro p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-verdeNeon/60 hover:shadow-[0_12px_40px_rgba(57,255,20,0.12)]"
        >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-verdeNeon/10 blur-xl transition-all duration-300 group-hover:scale-125" />

            <div className="relative flex items-start justify-between gap-4">
            <div>
                <p className="text-xs uppercase tracking-[1px] text-cinzaSuave">
                Torneio
                </p>

                <h3 className="mt-1 font-bebas-neue text-2xl tracking-[1px] text-white">
                {championship.championship_name}
                </h3>
            </div>

            <span className="rounded-full border border-verdeNeon/35 bg-verdeNeon/10 px-3 py-1 text-xs font-semibold text-verdeNeon">
                Ver detalhes
            </span>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-cinzaSuave">
            <span className="rounded-md bg-white/5 px-3 py-2">
                Sua Posição: #{championship.position}
            </span>

            <span className="rounded-md bg-white/5 px-3 py-2">
                {championship.championship_name === "Classificação Geral" ? 'Todos os Jogadores' : championship.total_points + ' pts'}
            </span> 
            
            </div>
        </Link>
    )
}