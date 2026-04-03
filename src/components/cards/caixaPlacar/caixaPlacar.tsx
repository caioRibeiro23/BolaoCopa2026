"use client";

export default function caixaPlacar({casaOuVisitante}: {casaOuVisitante: "casa" | "visitante"}) {
    return (
        <div className="flex flex-col gap-1 justify-center items-center">
            <span className="text-xs text-cinzaSuave">Predict</span>
            <input
                type="text"
                inputMode="numeric"
                required
                name={`placar-${casaOuVisitante}`}
                className="w-11 bp-540:w-13 aspect-square bg-azulEscuro rounded-lg text-verdeNeon text-center text-xl bp-540:text-2xl border border-verdeNeon/35 focus:outline-none focus:ring-1 focus:ring-verdeNeon/50 focus:border-verdeNeon/50 placeholder:text-cinzaSuave focus:placeholder-transparent"
                placeholder="?"
                autoComplete="off"
                onInput={(event) => {
                    const target = event.currentTarget;
                    target.value = target.value.replace(/\D/g, "");
                }}
            />
        </div>
    );
}