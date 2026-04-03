import Image from "next/image";
import HeroSection from "../components/HeroSection/herosection";
import CardAbertas from "../components/cards/cardAbertas";

export default function Home() {
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div>
      <HeroSection />

      {/* div geral da página inicial */}
      <div className="w-full px-8 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">

        {/* Partidas de Hoje */}
        <div className="w-full flex justify-between">
          <h1 className="font-bebas-neue text-2xl text-white tracking-[1.5px]">Partidas de Hoje</h1>
          <div className="px-3 py-2 bg-[#151C2C] rounded-md text-[#8895AA] text-xs">{dataHoje}</div>
        </div>

        {/* Cabeçalho das Partidas Abertas */}
        <div className="w-full flex flex-col gap-3 ">
          <div className="w-full px-[2px] gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
            <span className="text-verdeNeon text-xs font-inter tracking-[1.5px]">ABERTAS</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-verdeNeon/40 to-verdeNeon/0"></div>
          </div>

        <CardAbertas paisCasa = "Brasil" paisVisitante = "Argentina" hora = "20:00" grupo = "A" />

        </div>
      </div>
    </div>
  );
}
