export default function caixaPlacarEncerrado({placar}: {placar?: number }) {
    return (
        <div className="flex flex-col gap-1 justify-center items-center">
            <span className="text-xs text-cinzaSuave">Predict</span>
            <div  className="w-11 bp-540:w-13 aspect-square bg-azulEscuro rounded-lg text-cinzaSuave text-center text-xl bp-540:text-2xl border border-cinzaSuave/35 flex justify-center items-center">
                {placar !== undefined ? placar : <span className="text-cinzaSuave">-</span>}
            </div>
        </div>
    );
}