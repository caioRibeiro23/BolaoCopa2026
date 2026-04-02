import { Trophy } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative w-full bg-[url('/background/fundoHeroSection.png')] bg-cover bg-center text-center md:text-start p-12">
            <div className="absolute inset-0 bg-black/35 md:hidden" />
            <div className="relative z-10 flex flex-row justify-between items-center">
                <div className="w-full flex flex-col justify-center items-start gap-4 md:gap-2">
                    <span className="font-roboto text-xs text-verdeNeon leading-4 tracking-[3px]" >COPA DO MUNDO 2026 • FASE DE GRUPOS</span>
                    <h1 className="font-bebas-neue text-5xl text-white tracking-[2px]">FAÇA SEUS <span className="text-verdeNeon">PALPITES</span></h1>
                    <p className="font-inter text-sm text-[#8895AA]">Acompanhe todos os jogos, registre suas previsões e dispute com seus amigos no ranking em tempo real.</p>
                </div>
                <div className="hidden gap-2 md:flex flex-col w-fit items-end justify-center ml-15">
                    <div className="flex flex-row items-center gap-3 w-full">
                        <div className="w-12 h-12 px-3 bg-gradient-to-r from-[#F5C518] to-[#F97316] rounded-2xl shadow-xl">
                            <Trophy className="w-full h-full text-black" />
                        </div>
                        <div className="flex flex-col py-1 tracking-[2px]">
                            <span className="font-bebas-neue text-xl text-white">Copa do Mundo</span>
                            <span className="font-inter text-xs font-medium text-[#8895AA]">BOLÃO 2026</span>
                        </div>
                    </div>
                    <div className="whitespace-nowrap text-xs text-verdeNeon font-roboto tracking-[1.5px] bg-[#39FF14]/12 px-3 py-1 rounded-2xl border-[#39FF14]/25 border leading-4">
                        TEMPORADA 2026 ABERTA
                    </div>
                </div>
            </div>
        </section>
    );
}