interface CardStatsProps {
    titleCard: string,
    valueCard: string | number,
}

export default function CardStats({ titleCard, valueCard }: CardStatsProps) {
    return (
        <div className="rounded-2xl border border-azulCinzado bg-azulMedio px-4 py-4 flex flex-col justify-center items-center md:items-start">
            <p className="font-inter text-[11px] uppercase tracking-[1.5px] text-cinzaSuave">
                {titleCard}
            </p>
            <span className="mt-2 block font-bebas-neue text-3xl tracking-[2px] text-[#E8EDF5]">
                {valueCard}
            </span>
        </div>
    )
}