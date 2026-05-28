"use client";

import GameRules from "../../components/GameRules/gameRules";
import {useEffect, useState} from "react";
import { createClient } from "@/src/lib/supabase/client";
import HeroSection from "../../components/HeroSection/herosection";
import CardAbertas from "../../components/cards/cardAbertas";
import CardAoVivo from "../../components/cards/cardAoVivo";
import CardEncerradas from "../../components/cards/cardEncerradas";
import TitlePage from "../../components/ui/titlepage";
import { formatarHoraBR } from "../../utils/formatar-hora";
import { t } from "../../utils/traducaoPaises";
import { formatarDataBR } from "../../utils/formatar-data";

interface Match {
  id: string;
  team_home: string;
  team_away: string;
  date_time: string;
  
  group_letter: string;
  status: 'scheduled' | 'live' | 'finished';
  status_exibicao?: string;
  goals_home?: number;
  goals_away?: number;
  minute_play?: number;
}

interface UserBet {
  match_id: string;
  prediction_home: number;
  prediction_away: number;
}

export default function Home() {
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [userBets, setUserBets] = useState<Record<string, UserBet>>({}); // Mapa de match_id para UserBet

  useEffect(() => {
    async function getHomeData() {
      const supabase = createClient();

      // Configuração da data fictícia de testes (11 de Junho de 2026)
      const agora = new Date();
      agora.setDate(30); //era 11
      agora.setMonth(4);  //era 5
      agora.setFullYear(2026);

      const hojeInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);
      const amanhaFim = new Date(hojeInicio);
      amanhaFim.setDate(hojeInicio.getDate() + 1);
      amanhaFim.setHours(23, 59, 59, 999);

      const dataInicioISO = hojeInicio.toISOString();
      const dataFimISO = amanhaFim.toISOString();

      // Busca as partidas do período
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .gte('date_time', dataInicioISO)
        .lte('date_time', dataFimISO)
        .order('date_time', { ascending: true });

      if (!matchesError && matchesData) {
        setMatches(matchesData);

        // Tenta pegar o usuário logado para buscar os palpites dele
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && matchesData.length > 0) {
          const matchIds = matchesData.map((m: Match) => m.id);

          // Busca os palpites do usuário apenas para os jogos que estão na tela
          const { data: betsData } = await supabase
            .from('bets')
            .select('match_id, prediction_home, prediction_away')
            .eq('user_id', user.id)
            .in('match_id', matchIds);

          if (betsData) {
            // Transforma o array de palpites em um mapa indexado por match_id para busca rápida O(1)
            const betsMap = betsData.reduce((acc: Record<string, UserBet>, bet: UserBet) => {
              acc[bet.match_id] = bet;
              return acc;
            }, {} as Record<string, UserBet>);

            setUserBets(betsMap);
          }
        }
      }
    }

    getHomeData();
  }, []);

  const partidasAbertas = matches.filter(m => m.status === 'scheduled' && new Date().getTime() < new Date(m.date_time).getTime());
  
  const partidasAoVivo = matches.filter(m => 
    m.status === 'live' || 
    (m.status === 'scheduled' && new Date().getTime() >= new Date(m.date_time).getTime())
  );
  
  const partidasEncerradas = matches.filter(m => m.status === 'finished');

  return (
    <div>
      <HeroSection />

      {/* div de palpites da página inicial */}
      <div className="w-full px-8 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro min-h-screen">

        {/* Partidas de Hoje e Amanhã */}
        <TitlePage title="Partidas de Hoje e Amanhã"/>

        {/*Partidas Abertas */}
        <div className="w-full flex flex-col gap-6 ">
          {/* Cabeçalho das Partidas Abertas */}
          <div className="w-full px-0.5 gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
            <span className="text-verdeNeon text-xs font-inter tracking-[1.5px] font-bold">ABERTAS</span>
            <div className="h-px flex-1 bg-linear-to-r from-verdeNeon/40 to-verdeNeon/0"></div>
          </div>

          {/*Lista de partidas abertas*/}
        {partidasAbertas.map(jogo => (
            <CardAbertas 
              key={jogo.id}
              paisCasa={t(jogo.team_home)} 
              paisVisitante={t(jogo.team_away)} 
              hora={`${formatarDataBR(jogo.date_time)} - ${formatarHoraBR(jogo.date_time)}`} 
              grupo={jogo.group_letter} 
              matchId={jogo.id}
              date_time={jogo.date_time}
            />
          ))}
          {partidasAbertas.length === 0 && (
            <p className="text-cinzaSuave text-base px-0.5">Nenhuma partida disponível para palpites.</p>
          )}
        </div>

        {/* Partidas Ao Vivo */}
        <div className="w-full flex flex-col gap-6 ">
          {/* Cabeçalho das Partidas Ao Vivo */}
          <div className="w-full px-0.5 gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-[#FF4455] shadow-[0_0_8px_#FF4455]"></div>
            <span className="text-[#FF4455] text-xs font-inter tracking-[1.5px] font-bold">AO VIVO</span>
            <div className="h-px flex-1 bg-linear-to-r from-[#FF4455]/40 to-[#FF4455]/0"></div>
          </div>

          {partidasAoVivo.map(jogo => {
            const palpite = userBets[jogo.id];
            const apiAtrasada = jogo.status === 'scheduled' && new Date().getTime() >= new Date(jogo.date_time).getTime();
            const statusTempo = apiAtrasada ? "Aguardando início..." : jogo.status_exibicao || "Ao Vivo";  

            return (
              <CardAoVivo 
                key={jogo.id}
                paisCasa={t(jogo.team_home)} 
                paisVisitante={t(jogo.team_away)} 
                grupo={jogo.group_letter}
                placarCasa={jogo.goals_home ?? 0}
                placarVisitante={jogo.goals_away ?? 0}
                tempo={statusTempo}
                palpiteCasa={palpite?.prediction_home}
                palpiteVisitante={palpite?.prediction_away}
              />
            );
          })}
          {partidasAoVivo.length === 0 && (
            <p className="text-cinzaSuave text-base px-0.5">Nenhum jogo acontecendo agora.</p>
          )}
        </div>

        <div className="w-full flex flex-col gap-6 ">
          {/* Cabeçalho das Partidas Encerradas */}
          <div className="w-full px-0.5 gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-cinzaSuave"></div>
            <span className="text-cinzaSuave text-xs font-inter tracking-[1.5px] font-bold">ENCERRADAS</span>
            <div className="h-px flex-1 bg-linear-to-r from-cinzaSuave/40 to-cinzaSuave/0"></div>
          </div>
          {partidasEncerradas.map(jogo => {
            // Recupera o palpite feito para este jogo específico dentro do mapa de palpites
            const palpite = userBets[jogo.id];

            return (
              <CardEncerradas 
                key={jogo.id}
                paisCasa={t(jogo.team_home)} 
                paisVisitante={t(jogo.team_away)} 
                grupo={jogo.group_letter} 
                placarCasa={jogo.goals_home ?? 0}
                placarVisitante={jogo.goals_away ?? 0}
                palpiteCasa={palpite?.prediction_home} // Envia se houver, ou undefined se não houver aposta
                palpiteVisitante={palpite?.prediction_away}
              />
            );
          })}

          {partidasEncerradas.length === 0 && (
            <p className="text-cinzaSuave text-base px-0.5">Nenhum jogo encerrado recentemente.</p>
          )}     
        </div>

      </div>
      <GameRules/>
    </div>
  );
}
