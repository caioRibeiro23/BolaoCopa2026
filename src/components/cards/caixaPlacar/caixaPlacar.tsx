export default function caixaPlacar({casaOuVisitante}: {casaOuVisitante: "casa" | "visitante"}) {
    return (
        <div className="flex flex-col gap-1 justify-center items-center">
            <span className="text-xs text-cinzaSuave">Predict</span>
            <input type="text" name={`placar-${casaOuVisitante}`} className="w-13 aspect-square bg-azulEscuro rounded-lg text-verdeNeon text-center text-2xl border border-verdeNeon/35 focus:outline-none focus:ring-1 focus:ring-verdeNeon/50 focus:border-verdeNeon/50 placeholder:text-cinzaSuave focus:placeholder-transparent" placeholder="?" autoComplete="off" />
        </div>
    );
}