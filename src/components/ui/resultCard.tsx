import type { StatusPontuacao } from "../../components/cards/cardEncerradas";

interface ResultCardProps {
    status: StatusPontuacao;
}

export default function ResultCard({ status }: ResultCardProps) {
    // 🧠 Mapeamento de estilos, textos e pontos por status
    const cardConfig = {
        exato: {
            texto: "✓ Placar Exato",
            pontos: "+9 pts",
            estilo: "bg-verdeNeon/8 text-verdeNeon border-verdeNeon/20"
        },
        combo: {
            texto: "✓ Combo",
            pontos: "+5 pts",
            estilo: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        },
        resultado: {
            texto: "✓ Resultado Correto",
            pontos: "+3 pts",
            estilo: "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/25"
        },
        um_gol: {
            texto: "✓ Acertou um dos Gols",
            pontos: "+1 pt",
            estilo: "bg-orange-500/10 text-orange-400 border-orange-500/20"
        },
        incorreto: {
            texto: "✗ Errou o Palpite",
            pontos: "+0 pts",
            estilo: "bg-vermelhoVibrante/8 text-vermelhoVibrante border-vermelhoVibrante/20"
        }
    };

    // Caso o usuário não tenha feito palpite (status === undefined)
    if (status === undefined) {
        return (
            <div className="w-full flex justify-center items-center pb-5">
                <button className="px-4 py-2 bg-cinzaSuave/5 text-cinzaSuave rounded-lg font-normal font-inter text-xs bp-540:text-sm tracking-[1px] shadow-md border border-cinzaSuave/20" type="submit" disabled>
                    Sem Palpite <span className="font-bold">+0 pts</span>
                </button>
            </div>
        );
    }

    // Puxa a configuração baseada no status recebido
    const atual = cardConfig[status];

    return (
        <div className="w-full flex justify-center items-center pb-5">
            <button className={`px-4 py-2 rounded-lg font-normal font-inter text-xs bp-540:text-sm tracking-[1px] shadow-md border ${atual.estilo}`} type="submit" disabled>
                {atual.texto} <span className="font-bold">{atual.pontos}</span>
            </button>
        </div>
    );
}