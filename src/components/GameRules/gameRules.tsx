import { Target, Star, Rocket, Trophy } from "lucide-react";

export default function GameRules() {
  const rules = [
    {
      icon: <Target className="text-green-400" size={28} />,
      title: "Palpite o placar",
      description:
        "Insira o placar exato final de cada partida antes do pontapé inicial. Todos os palpites serão finalizados quando a partida começar.",
    },
    {
      icon: <Star className="text-yellow-400" size={28} />,
      title: "Some pontos",
      description:
        "+9 pts para placar exato • +3 pts para resultado correto • +1 pt para acertar os gols de um time • +5 pts o combo das duas anteriores • 0 pts para palpite incorreto",
    },
    {
      icon: <Rocket className="text-purple-400" size={28} />,
      title: "Até o último minuto",
      description:
        "A esperança é a última que morre. Acertar o placar exato na final vale o dobro de pontos. Aqui você tem chance até o último minuto",
    },
    {
      icon: <Trophy className="text-red-400" size={28} />,
      title: "Vença o Campeonato",
      description:
        "O maior pontuador após a final leva o grande prêmio. Critérios de desempate: 1º Placares Exatos • 2º Combos • 3º Resultados Corretos.",
    },
  ];

  return (
    <div className="bg-[#0b1220] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-green-500 flex-1 max-w-xs" />
          <h2 className="mx-6 text-lg tracking-widest text-gray-300">
            REGRAS DO JOGO
          </h2>
          <div className="h-px bg-green-500 flex-1 max-w-xs" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="bg-[#111a2e] border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="mb-4">{rule.icon}</div>
              <h3 className="text-lg font-semibold mb-2">
                {rule.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>

        {/* Aviso */}
        <div className="mt-10 border border-gray-700 rounded-xl p-4 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
          <span className="text-yellow-400">⚠</span>
          Os palpites são apenas para diversão. Esta é uma competição entre
          amigos. Jogue limpo e respeite as regras.
        </div>
      </div>
    </div>
  );
}