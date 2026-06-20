interface TitlePageProps {
    title: string;
}

export default function TitlePage({ title }: TitlePageProps) {
    const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    return(
        <div className="w-full flex justify-between">
            <h1 className="font-bebas-neue text-2xl text-white tracking-[1.5px]">{title}</h1>
            {/* <div className="px-3 py-2 bg-azulCinzado rounded-md text-cinzaSuave text-xs">{dataHoje}</div> */}
        </div>
    )
}