"use client";

import {useEffect, useState} from "react";
import { createClient } from "@supabase/supabase-js";
import HeroSection from "../components/HeroSection/herosection";
import CardAbertas from "../components/cards/cardAbertas";
import CardAoVivo from "../components/cards/cardAoVivo";
import CardEncerradas from "../components/cards/cardEncerradas";
import TitlePage from "../components/ui/titlepage";

interface Match {
  id: string;
  team_home: string;
  team_away: string;
  date_time: string;
  group_letter: string;
  status: 'scheduled' | 'live' | 'finished';
  goals_home?: number;
  goals_away?: number;
}

const traduçãoPaises: { [key: string]: string } = {
    // Anfitriões
    "Canada": "Canadá",
    "USA": "Estados Unidos",
    "United States": "Estados Unidos",
    "United States of America": "Estados Unidos",
    "Mexico": "México",

    // América do Sul (CONMEBOL)
    "Argentina": "Argentina",
    "Brazil": "Brasil",
    "Colombia": "Colômbia",
    "Ecuador": "Equador",
    "Paraguay": "Paraguai",
    "Uruguay": "Uruguai",

    // Europa (UEFA)
    "Germany": "Alemanha",
    "Austria": "Áustria",
    "Belgium": "Bélgica",
    "Bosnia-Herzegovina": "Bósnia-Herzegovina",
    "Croatia": "Croácia",
    "Scotland": "Escócia",
    "Spain": "Espanha",
    "France": "França",
    "Netherlands": "Holanda",
    "England": "Inglaterra",
    "Norway": "Noruega",
    "Portugal": "Portugal",
    "Czech Republic": "República Tcheca",
    "Czechia": "República Tcheca",
    "Sweden": "Suécia",
    "Switzerland": "Suíça",
    "Turkey": "Turquia",

    // África (CAF)
    "South Africa": "África do Sul",
    "Algeria": "Argélia",
    "Cape Verde Islands": "Cabo Verde",
    "Ivory Coast": "Costa do Marfim",
    "Egypt": "Egito",
    "Ghana": "Gana",
    "Morocco": "Marrocos",
    "DR Congo": "RD Congo",
    "Congo DR": "RD Congo",
    "Senegal": "Senegal",
    "Tunisia": "Tunísia",

    // Ásia (AFC)
    "Saudi Arabia": "Arábia Saudita",
    "Australia": "Austrália",
    "Qatar": "Qatar",
    "South Korea": "Coreia do Sul",
    "Korea Republic": "Coreia do Sul",
    "Iran": "Irã",
    "Iraq": "Iraque",
    "Japan": "Japão",
    "Jordan": "Jordânia",
    "Uzbekistan": "Uzbequistão",

    // América do Norte/Caribe (CONCACAF)
    "Curaçao": "Curaçao",
    "Haiti": "Haiti",
    "Panama": "Panamá",

    // Oceania (OFC)
    "New Zealand": "Nova Zelândia"
};

const t = (nome: string | undefined | null) => {
  if (!nome) return "TBD"; // "To Be Defined" para jogos sem time
  return traduçãoPaises[nome] || nome;
};


export default function Home() {
  
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function getMatches() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .gte('date_time', '2025-01-01T00:00:00+00:00') // Pega tudo desde o ano passado
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

        {/* Partidas de Hoje */}
        <TitlePage title="Partidas de Hoje"/>

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
              hora={new Date(jogo.date_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} 
              grupo={jogo.group_letter} 
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
