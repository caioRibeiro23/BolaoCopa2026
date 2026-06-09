"use client";

import GameRules from "../../components/GameRules/gameRules";
import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import HeroSection from "../../components/HeroSection/herosection";
import CardAbertas from "../../components/cards/cardAbertas";
import CardAoVivo from "../../components/cards/cardAoVivo";
import CardEncerradas from "../../components/cards/cardEncerradas";
import { formatarHoraBR } from "../../utils/formatar-hora";
import { t } from "../../utils/traducaoPaises";
import { formatarDataBR } from "../../utils/formatar-data";
import { formatarExtensoBR } from "../../utils/formatar-data-extenso";

type MatchPhase = 'group_stage' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'third_place' | 'final';
type MatchStatus = 'scheduled' | 'live' | 'finished';

interface Match {
  id: string;
  team_home: string;
  team_away: string;
  date_time: string;
  phase: MatchPhase;
  group_letter: string;
  status: MatchStatus;
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

// 📅 CALENDÁRIO OFICIAL CRONOLÓGICO DA COPA 2026
const CRONOGRAMA_COPA = [
  { nome: "Fase de Grupos - Rodada 1", fim: new Date(2026, 5, 17) },
  { nome: "Fase de Grupos - Rodada 2", fim: new Date(2026, 5, 23) },
  { nome: "Fase de Grupos - Rodada 3", fim: new Date(2026, 5, 27) },
  { nome: "Dezesseis-avos de Final", fim: new Date(2026, 6, 3) },
  { nome: "Oitavas de Final", fim: new Date(2026, 6, 7) },
  { nome: "Quartas de Final", fim: new Date(2026, 6, 11) },
  { nome: "Semifinais", fim: new Date(2026, 6, 15) },
  { nome: "Decisão do 3º Lugar e Final", fim: new Date(2026, 6, 19) }
];

const OBTER_DATA_SISTEMA = () => {
  const dataSimulada = new Date();
  dataSimulada.setFullYear(2026);
  dataSimulada.setMonth(5); // Junho
  dataSimulada.setDate(20); 
  dataSimulada.setHours(22, 0, 0, 0); // Meio-dia para evitar problemas de fuso horário
  return dataSimulada;
};

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [userBets, setUserBets] = useState<Record<string, UserBet>>({});
  const [avisoCronograma, setAvisoCronograma] = useState<string | null>(null);

  const dataInicialCopa = new Date(2026, 5, 11, 0, 0, 0, 0); // 11 de Junho de 2026 cravado

  const [dataSelecionada, setDataSelecionada] = useState<Date>(() => {
    const hoje = OBTER_DATA_SISTEMA();
    return hoje < dataInicialCopa ? dataInicialCopa : new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0, 0);
  });

  // 🕒 1. Valores computados em tempo de renderização (Sempre atualizados)
  const dataSelecionadaZerada = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), dataSelecionada.getDate(), 0, 0, 0, 0);
  const hojeSistema = OBTER_DATA_SISTEMA();
  hojeSistema.setHours(0, 0, 0, 0);

  // Encontra a qual bloco cronológico o DIA EXIBIDO na tela pertence
  const blocoDaTela = CRONOGRAMA_COPA.find((fase) => dataSelecionadaZerada <= fase.fim) || CRONOGRAMA_COPA[CRONOGRAMA_COPA.length - 1];
  // Encontra a qual bloco cronológico a DATA ATUAL REAL DO SISTEMA pertence

  const nomeRodadaExibicao = blocoDaTela.nome;
  const ultimoDiaDaRodadaAtiva = blocoDaTela.fim;

  // 1️⃣ Encontra a posição numérica (índice) de cada bloco dentro do cronograma oficial
  const indexFaseTela = CRONOGRAMA_COPA.findIndex((fase) => dataSelecionadaZerada <= fase.fim);
  const indexFaseSistema = CRONOGRAMA_COPA.findIndex((fase) => hojeSistema <= fase.fim);

  // 💡 Resolve o caso do último elemento (se não achar os índices no findIndex)
  const idxTela = indexFaseTela !== -1 ? indexFaseTela : CRONOGRAMA_COPA.length - 1;
  const idxSistema = indexFaseSistema !== -1 ? indexFaseSistema : CRONOGRAMA_COPA.length - 1;

  // 2️⃣ Calcula o penúltimo dia baseado estritamente na rodada que o sistema (vida real) está processando agora
  const rodadaRealDoSistema = CRONOGRAMA_COPA[idxSistema];
  const penultimoDiaDoSistema = new Date(rodadaRealDoSistema.fim.getFullYear(), rodadaRealDoSistema.fim.getMonth(), rodadaRealDoSistema.fim.getDate(), 0, 0, 0, 0);
  penultimoDiaDoSistema.setDate(penultimoDiaDoSistema.getDate() - 1);

  // 🔓 REGRA DE OURO CRONOLÓGICA (Inquebrável):
  // - Se a tela está na mesma fase do sistema ou em fases anteriores, a navegação é totalmente liberada (true).
  // - Se a tela tenta entrar na fase imediatamente seguinte (fase do sistema + 1), ela só libera se hoje já for o PENÚLTIMO DIA da fase atual.
  // - Se a tela tentar pular duas ou mais fases à frente, o bloqueio é imediato e absoluto (false).
  const permitirAvancarRodada = idxTela < idxSistema 
    ? true 
    : idxTela === idxSistema 
      ? hojeSistema.getTime() >= penultimoDiaDoSistema.getTime() 
      : false;

  // 🛡️ LÓGICA DE TRAVAS DIÁRIAS CRUCIAIS (Comparação de Timestamps limpos)
  const desabilitarAnterior = dataSelecionadaZerada.getTime() <= dataInicialCopa.getTime();
  const desabilitarProximo = dataSelecionadaZerada.getTime() >= ultimoDiaDaRodadaAtiva.getTime() && !permitirAvancarRodada;
  // 2️⃣ useEffect: Busca os jogos e palpites do dia selecionado
  useEffect(() => {
    async function getHomeData() {
      const supabase = createClient();

      const hojeInicio = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), dataSelecionada.getDate(), 0, 0, 0, 0);
      const hojeFim = new Date(hojeInicio);
      hojeFim.setHours(23, 59, 59, 999);

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .gte('date_time', hojeInicio.toISOString())
        .lte('date_time', hojeFim.toISOString())
        .order('date_time', { ascending: true });

      if (!matchesError && matchesData) {
        setMatches(matchesData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user && matchesData.length > 0) {
          const matchIds = matchesData.map((m: Match) => m.id);
          const { data: betsData } = await supabase
            .from('bets')
            .select('match_id, prediction_home, prediction_away')
            .eq('user_id', user.id)
            .in('match_id', matchIds);

          if (betsData) {
            const betsMap = betsData.reduce((acc: Record<string, UserBet>, bet: UserBet) => {
              acc[bet.match_id] = bet;
              return acc;
            }, {} as Record<string, UserBet>);
            setUserBets(betsMap);
          }
        } else if (matchesData.length === 0) {
          setUserBets({});
        }
      }
    }

    getHomeData();
  }, [dataSelecionada]);

  const alterarDia = (dias: number) => {
  const novaData = new Date(dataSelecionada);
  novaData.setDate(novaData.getDate() + dias);
  novaData.setHours(0, 0, 0, 0);
  setDataSelecionada(novaData);
  setAvisoCronograma(null); // Limpa o aviso ao mudar de dia válido
};
  const lidarCliqueProximo = () => {
  if (desabilitarProximo) {
    // Se a trava disparar porque ele tentou avançar além do limite permitido da rodada atual
    setAvisoCronograma(`Os palpites da próxima rodada abrem automaticamente 2 dias antes da atual terminar!`);
    
    // Remove o aviso sumir sozinho após 5 segundos para não poluir a tela
    setTimeout(() => setAvisoCronograma(null), 5000);
    return;
  }
  
  alterarDia(1);
  };

  // Filtros dos cards usando a data controlada do sistema
  const tempoAtualMilissegundos = OBTER_DATA_SISTEMA().getTime();
  const obterTimestampGarantido = (dateTimeStr: string) => {
    // 1. Substitui o espaço por 'T' para ficar no padrão ISO internacional
    let isoStr = dateTimeStr.replace(" ", "T");
    
    // 2. Se a string não terminar com 'Z', nós injetamos o 'Z' para forçar o JS 
    // a ler esse horário como UTC puro (GTM 0) antes de converter para o fuso do usuário
    if (!isoStr.endsWith("Z") && !isoStr.includes("-03")) {
      isoStr = `${isoStr}Z`;
    }
    
    return new Date(isoStr).getTime();
  };
  const partidasAbertas = matches.filter(m => m.status === 'scheduled' && tempoAtualMilissegundos < obterTimestampGarantido(m.date_time));
  const partidasAoVivo = matches.filter(m => m.status === 'live' || (m.status === 'scheduled' && tempoAtualMilissegundos >= obterTimestampGarantido(m.date_time)));
  const partidasEncerradas = matches.filter(m => m.status === 'finished');

  return (
    <div>
      <HeroSection />

      <div className="w-full px-6 py-14 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro min-h-screen justify-start items-center">

        {/* Título da Rodada */}
        <div className="text-center -mb-4">
          <span className="text-verdeNeon font-inter text-xs font-bold tracking-[1px] sm:tracking-[3px] uppercase bg-verdeNeon/10 border border-verdeNeon/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(57,255,20,0.1)]">
            {nomeRodadaExibicao}
          </span>
        </div>

        {/* Seletor de Data */}
        <div className="w-full flex items-center justify-between bg-azulCard/40 border border-verdeNeon/10 rounded-2xl p-4 md:p-5 select-none shadow-md">
          <button 
            onClick={() => alterarDia(-1)}
            className={`text-xl md:text-2xl font-bold p-2 transition-colors ${desabilitarAnterior ? "text-cinzaSuave/30 cursor-default" : "text-verdeNeon hover:text-verdeNeon cursor-pointer"}`}
            aria-label="Dia anterior"
            disabled={desabilitarAnterior}
          >
            &lt;
          </button>
          
          <h2 className="text-white text-base md:text-xl font-inter font-semibold tracking-wide text-center">
            {formatarExtensoBR(dataSelecionada)}
          </h2>

          <button 
            onClick={lidarCliqueProximo}
            className={`text-xl md:text-2xl font-bold p-2 transition-colors ${desabilitarProximo ? "text-cinzaSuave/30 cursor-default" : "text-verdeNeon hover:text-verdeNeon cursor-pointer"}`}
            aria-label="Próximo dia"
          >
            &gt;
          </button>
        </div>
        {avisoCronograma && (
          <div className="w-full text-center bg-azulCard/80 border border-yellow-500/35 rounded-xl p-3 animate-fade-in">
            <p className="text-yellow-400 font-inter text-xs md:text-sm font-medium">
              ⚠️ {avisoCronograma}
            </p>
          </div>
        )}
        {/* Listas de Cards (Abertas, Ao Vivo, Encerradas) */}
        <div className="w-full flex flex-col gap-6 ">
          <div className="w-full px-0.5 gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
            <span className="text-verdeNeon text-xs font-inter tracking-[1.5px] font-bold">ABERTAS</span>
            <div className="h-px flex-1 bg-linear-to-r from-verdeNeon/40 to-verdeNeon/0"></div>
          </div>

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
          <div className="w-full px-0.5 gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-[#FF4455] shadow-[0_0_8px_#FF4455]"></div>
            <span className="text-[#FF4455] text-xs font-inter tracking-[1.5px] font-bold">AO VIVO</span>
            <div className="h-px flex-1 bg-linear-to-r from-[#FF4455]/40 to-[#FF4455]/0"></div>
          </div>

          {partidasAoVivo.map(jogo => {
            const palpite = userBets[jogo.id];
            const apiAtrasada = jogo.status === 'scheduled' && tempoAtualMilissegundos >= obterTimestampGarantido(jogo.date_time);
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

        {/* Partidas Encerradas */}
        <div className="w-full flex flex-col gap-6 ">
          <div className="w-full px-0.5 gap-2 flex flex-row items-center">
            <div className="w-2 h-2 aspect-square rounded-4xl bg-cinzaSuave"></div>
            <span className="text-cinzaSuave text-xs font-inter tracking-[1.5px] font-bold">ENCERRADAS</span>
            <div className="h-px flex-1 bg-linear-to-r from-cinzaSuave/40 to-cinzaSuave/0"></div>
          </div>
          {partidasEncerradas.map(jogo => {
            const palpite = userBets[jogo.id];
            return (
              <CardEncerradas 
                key={jogo.id}
                paisCasa={t(jogo.team_home)} 
                paisVisitante={t(jogo.team_away)} 
                grupo={jogo.group_letter} 
                placarCasa={jogo.goals_home ?? 0}
                placarVisitante={jogo.goals_away ?? 0}
                palpiteCasa={palpite?.prediction_home}
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