import Image from "next/image";
import HeroSection from "../components/HeroSection/herosection";
import GameRules from "../components/GameRules/gameRules";

export default function Home() {
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div>
      <HeroSection />
      <div className="w-full px-8 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
        <div className="w-full flex justify-between">
          <h1 className="font-bebas-neue text-2xl text-white tracking-[1.5px]">Partidas de Hoje</h1>
          <div className="px-3 py-2 bg-[#151C2C] rounded-md text-[#8895AA] text-xs">{dataHoje}</div>
        </div>
      </div>
      <GameRules/>
    </div>
  );
}
