export default function caixaPlacarFechado({placar}: {placar?: number }) {
    return (
        <div className="flex flex-col gap-1 justify-center items-center">
            <span className="text-xs text-cinzaSuave">Predict</span>
            <div  className="w-13 aspect-square bg-azulEscuro rounded-lg text-verdeNeon text-center text-2xl border border-verdeNeon/35 flex justify-center items-center">
                {placar !== undefined ? placar : <span className="text-cinzaSuave">-</span>}
            </div>
        </div>
    );
}