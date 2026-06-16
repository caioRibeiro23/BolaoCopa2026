import Link from "next/link";
export default function HeroSection() {
    return (
        <>
        <section className="relative w-full bg-[url('/background/fundoHeroSection.png')] bg-cover bg-center text-center md:text-start p-12">
            <div className="absolute inset-0 bg-black/35 md:hidden" />
            <div className="relative z-10 flex flex-row justify-between items-center">
                <div className="w-full flex flex-col justify-center items-start gap-4 md:gap-2">
                    <span className="font-roboto text-xs text-verdeNeon leading-4 tracking-[3px]" >COPA DO MUNDO 2026 • FASE DE GRUPOS</span>
                    <h1 className="font-bebas-neue text-5xl text-white tracking-[2px]">FAÇA SEUS <span className="text-verdeNeon">PALPITES</span></h1>
                    <p className="font-inter text-sm text-cinzaSuave">Acompanhe todos os jogos, registre suas previsões e dispute com seus amigos no ranking em tempo real.</p>
                    <div className="w-full mt-4 md:mt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-3 w-full">
                            <Link href="/rules" aria-label="Ver Regras" className="inline-block w-full md:w-auto text-center px-5 py-2 rounded-lg bg-verdeNeon text-[#061014] font-semibold shadow-[0_0_12px_rgba(57,255,20,0.18)] hover:brightness-105 transition-all duration-200 text-sm md:text-base hover:scale-105 border border-verdeNeon">Ver Regras</Link>
                            <Link href="/myTournaments" aria-label="Ver Torneios" className="inline-block w-full md:w-auto text-center px-5 py-2 rounded-lg mt-3 md:mt-0 bg-azulEscuro/20 border border-verdeNeon text-verdeNeon font-semibold hover:bg-azulEscuro/60 transition duration-200 text-sm md:text-base">Ver Torneios</Link>
                        </div>
                    </div>
                </div>
                <div className="hidden gap-2 md:flex flex-col w-fit items-end justify-center ml-15">
                    <div className="flex flex-row items-center gap-3 w-full">
                        <div className="w-12 h-12 px-3 bg-[url('/bolazzo.jpg')] bg-contain bg-center rounded-xl">

                        </div>
                        <div className="flex flex-col py-1 tracking-[2px]">
                            <span className="font-bebas-neue text-xl text-white">Copa do Mundo</span>
                            <span className="font-inter text-xs font-medium text-cinzaSuave">BOLÃO 2026</span>
                        </div>
                    </div>
                    <div className="whitespace-nowrap text-xs text-verdeNeon font-roboto tracking-[1.5px] bg-verdeNeon/12 px-3 py-1 rounded-2xl border-verdeNeon/25 border leading-4">
                        TEMPORADA 2026 ABERTA
                    </div>
                </div>
            </div>
        </section>

        <div className="w-full bg-azulEscuro/90 border-t border-azulCinzado">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-center gap-3">
                <p className="text-sm text-cinzaSuave">
                    ⏱ A seção de palpites extras está aberta até <span className="font-semibold text-white">dia 17</span>.
                </p>
                <Link href="/extra" className="inline-block px-4 py-2 rounded-lg bg-transparent border border-verdeNeon text-verdeNeon font-semibold text-sm shadow-[0_0_10px_rgba(57,255,20,0.12)] hover:bg-azulEscuro transition">Ir para palpites extras</Link>
            </div>
            
        </div>
      
        </>
    );
}