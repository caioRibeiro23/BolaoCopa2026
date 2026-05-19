"use client";

import {useEffect, useState} from "react";
import { createClient } from "@/src/lib/supabase/client";
import HeroSection from "../components/HeroSection/herosection";
import CardAbertas from "../components/cards/cardAbertas";
import CardAoVivo from "../components/cards/cardAoVivo";
import CardEncerradas from "../components/cards/cardEncerradas";
import TitlePage from "../components/ui/titlepage";
import { formatarHoraBR } from "../utils/formatar-hora";
import { t } from "../utils/traducaoPaises";
import { formatarDataBR } from "../utils/formatar-data";

interface Match {
  id: string;
  team_home: string;
  team_away: string;
  date_time: string;
  
  group_letter: string;
  status: 'scheduled' | 'live' | 'finished';
  goals_home?: number;
  goals_away?: number;
  minute_play?: number;
}

export default function Home() {
  
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function getMatches() {
      const supabase = createClient();

      // 1. Pega a data e hora EXATA de agora (seja dia 11, 12, 13...)
      const agora = new Date();

      //APENAS PARA TESTES: FORÇA A DATA PARA 11 DE JUNHO DE 2026, PARA VER AS PARTIDAS DE HOJE FUNCIONANDO
      agora.setDate(11);
      agora.setMonth(5); // Junho no JavaScript é mês 5 (0 = Janeiro, 1 = Fevereiro...)
      agora.setFullYear(2026);

      // 2. Cria o "Início de Hoje" (00:00:00) baseado no dia atual
      const hojeInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);
      
      // 3. Cria o "Fim de Amanhã" (23:59:59) somando 1 dia ao hoje
      const amanhaFim = new Date(hojeInicio);
      amanhaFim.setDate(hojeInicio.getDate() + 1);
      amanhaFim.setHours(23, 59, 59, 999);

      // 4. Converte para ISO para o Supabase entender
      const dataInicioISO = hojeInicio.toISOString();
      const dataFimISO = amanhaFim.toISOString();

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .gte('date_time', dataInicioISO)
        .lte('date_time', dataFimISO)
        .order('date_time', { ascending: true });

      if (!error && data) {
        setMatches(data);
      }
    }

    getMatches();
  }, []);

  return (
    <div>
      <HeroSection />

      {/* div de palpites da página inicial */}
      <div className="w-full px-8 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">

        {/* Partidas de Hoje e Amanhã */}
        <TitlePage title="Partidas de Hoje e Amanhã"/>

        {/*Partidas Abertas */}
        <div className="w-full flex flex-col gap-3 ">
          {/* Cabeçalho das Partidas Abertas */}
          <div className="w-full px-[2px] gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
            <span className="text-verdeNeon text-xs font-inter tracking-[1.5px] font-bold">ABERTAS</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-verdeNeon/40 to-verdeNeon/0"></div>
          </div>

          {/*Lista de partidas abertas*/}
        {matches.filter(m => m.status === 'scheduled').map(jogo => (
            <CardAbertas 
              key={jogo.id}
              paisCasa={t(jogo.team_home)} 
              paisVisitante={t(jogo.team_away)} 
              hora={`${formatarDataBR(jogo.date_time)} - ${formatarHoraBR(jogo.date_time)}`} 
              grupo={jogo.group_letter} 
              matchId={jogo.id}
            />
          ))}
        </div>

        {/* Partidas Ao Vivo */}
        <div className="w-full flex flex-col gap-3 ">
          {/* Cabeçalho das Partidas Ao Vivo */}
          <div className="w-full px-[2px] gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-[#FF4455] shadow-[0_0_8px_#FF4455]"></div>
            <span className="text-[#FF4455] text-xs font-inter tracking-[1.5px] font-bold">AO VIVO</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#FF4455]/40 to-[#FF4455]/0"></div>
          </div>

          {matches.filter(m => m.status === 'live').map(jogo => (
            <CardAoVivo 
              key={jogo.id}
              paisCasa={t(jogo.team_home)} 
              paisVisitante={t(jogo.team_away)} 
              grupo={jogo.group_letter}
              placarCasa={jogo.goals_home ?? 0}
              placarVisitante={jogo.goals_away ?? 0}
              tempo={String(jogo.minute_play || 0)} 
            />
          ))}
          {matches.filter(m => m.status === 'live').length === 0 && (
            <p className="text-cinzaSuave text-base px-[2px]">Nenhum jogo acontecendo agora.</p>
          )}
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
