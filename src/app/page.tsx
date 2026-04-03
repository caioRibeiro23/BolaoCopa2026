import Image from "next/image";
import HeroSection from "../components/HeroSection/herosection";
import CardAbertas from "../components/cards/cardAbertas";
import CardAoVivo from "../components/cards/cardAoVivo";
import CardEncerradas from "../components/cards/cardEncerradas";

export default function Home() {
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div>
      <HeroSection />

      {/* div de palpites da página inicial */}
      <div className="w-full px-8 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">

        {/* Partidas de Hoje */}
        <div className="w-full flex justify-between">
          <h1 className="font-bebas-neue text-2xl text-white tracking-[1.5px]">Partidas de Hoje</h1>
          <div className="px-3 py-2 bg-[#151C2C] rounded-md text-[#8895AA] text-xs">{dataHoje}</div>
        </div>

        {/*Partidas Abertas */}
        <div className="w-full flex flex-col gap-3 ">
          {/* Cabeçalho das Partidas Abertas */}
          <div className="w-full px-[2px] gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
            <span className="text-verdeNeon text-xs font-inter tracking-[1.5px] font-bold">ABERTAS</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-verdeNeon/40 to-verdeNeon/0"></div>
          </div>

          {/*Lista de partidas abertas*/}

          <CardAbertas paisCasa = "Brasil" paisVisitante = "Argentina" hora = "20:00" grupo = "A" />
          <CardAbertas paisCasa = "França" paisVisitante = "Alemanha" hora = "16:00" grupo = "B" />

        </div>

        {/* Partidas Ao Vivo */}
        <div className="w-full flex flex-col gap-3 ">
          {/* Cabeçalho das Partidas Ao Vivo */}
          <div className="w-full px-[2px] gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-[#FF4455] shadow-[0_0_8px_#FF4455]"></div>
            <span className="text-[#FF4455] text-xs font-inter tracking-[1.5px] font-bold">AO VIVO</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#FF4455]/40 to-[#FF4455]/0"></div>
          </div>

          <CardAoVivo paisCasa = "Inglaterra" paisVisitante = "Espanha" grupo = "C" tempo = "45" placarCasa = {1} placarVisitante = {0} palpiteCasa={2} palpiteVisitante={1}/>
          <CardAoVivo paisCasa = "Itália" paisVisitante = "Holanda" grupo = "D" tempo = "30" placarCasa = {0} placarVisitante = {0} />
        </div>

        <div className="w-full flex flex-col gap-3 ">
          {/* Cabeçalho das Partidas Ao Vivo */}
          <div className="w-full px-[2px] gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-cinzaSuave"></div>
            <span className="text-cinzaSuave text-xs font-inter tracking-[1.5px] font-bold">ENCERRADAS</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-cinzaSuave/40 to-cinzaSuave/0"></div>
          </div>
          <CardEncerradas paisCasa = "México" paisVisitante = "Colômbia" grupo = "E" tempo = "90" placarCasa = {1} placarVisitante = {2} palpiteCasa={1} palpiteVisitante={2}/>
          <CardEncerradas paisCasa = "Japão" paisVisitante = "Coreia do Sul" grupo = "F" tempo = "90" placarCasa = {0} placarVisitante = {0} palpiteCasa={1} palpiteVisitante={0}/>
          <CardEncerradas paisCasa = "Portugal" paisVisitante = "Bélgica" grupo = "G" tempo = "90" placarCasa = {2} placarVisitante = {1} palpiteCasa={1} palpiteVisitante={0}/>
          <CardEncerradas paisCasa = "Suíça" paisVisitante = "Áustria" grupo = "H" tempo = "90" placarCasa = {0} placarVisitante = {3} />
        </div>

      </div>
    </div>
  );
}
