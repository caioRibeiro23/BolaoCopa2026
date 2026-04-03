import Flag from "./iconePais/flag";
import CaixaPlacar from "./caixaPlacar/caixaPlacar";
import { getCountryAbbr } from "./iconePais/countryAbbr";

interface CardAbertasProps {
    paisCasa: string;
    paisVisitante: string;
    hora: string;
    grupo: string;

}

export default function CardAbertas({ paisCasa, paisVisitante, hora, grupo }: CardAbertasProps) {
    return (
        <form className="w-full flex flex-col bg-azulMedio rounded-2xl">

            {/* Cabeçalho do Card */}
            <div className="w-full flex justify-between px-5 py-3 bg-azulCinzado shadow-inner rounded-t-2xl text-xs font-inter">
                <div className="text-white w-full flex justify-start items-center gap-2">
                    <div className="w-2 h-2 aspect-square rounded-4xl bg-verdeNeon shadow-[0_0_8px_#39FF14]"></div>
                    <span className="text-verdeNeon tracking-[1px]">OPEN</span> 
                    <span className="text-cinzaSuave whitespace-nowrap">Kick-off {hora}</span>
                </div>
                <div className="text-cinzaSuave w-full text-end bp-540:text-center">Grupo {grupo}</div>
                <div className="text-verdeNeon w-full text-end font-roboto hidden bp-540:block"> +3 pts placar exato / +1 pt resultado</div>
            </div>

            {/* Corpo do Card */}
            <div className="w-full px-2 bp-540:px-6 py-5 flex flex-row items-center">
                <div className="w-full py-2 text-start text-cinzaSuave font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3">
                    <Flag country={paisCasa} />
                    <span className="md:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisCasa)}</span>
                    <span className="hidden md:block">{paisCasa}</span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <CaixaPlacar casaOuVisitante="casa" />
                    <div className="py-2">
                        <div className="px-1 pt-7 pb-3">
                            <span className="text-lg text-cinzaSuave">:</span>
                        </div>

                    </div>
                    <CaixaPlacar casaOuVisitante="visitante" />
                </div>
                <div className="w-full py-2 text-end text-cinzaSuave font-bold font-inter text-base flex flex-col bp-540:flex-row items-center bp-540:items-center gap-1 bp-540:gap-3 justify-end">
                    <span className="hidden md:block">{paisVisitante}</span>
                    <span className="hidden bp-540:block md:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
                    <Flag country={paisVisitante} />
                    <span className="bp-540:hidden text-base tracking-[1px] text-cinzaSuave">{getCountryAbbr(paisVisitante)}</span>
                </div>

            </div>

            {/* Rodapé do Card */}
            <div className="w-full flex justify-center items-center pb-5">
                <button className="px-4 py-2 bg-verdeNeon text-black rounded-lg font-bold font-inter text-sm tracking-[1px] shadow-md hover:bg-verdeNeon/70  duration-200 hover:scale-105 transition-all cursor-pointer" type="submit">
                    Enviar Palpite →
                </button>
            </div>
        {/* <img 
  src={`https://flagcdn.com/w40/${codCasa.toLowerCase()}.png`} 
  alt={paisCasa}
  className="w-6 h-auto rounded-sm"
/> */}
        </form>
    );
}