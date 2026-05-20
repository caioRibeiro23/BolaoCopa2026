"use client";

interface CaixaPlacarProps {
  casaOuVisitante: "casa" | "visitante";
    value: number | null;
    onChange: (val: number | null) => void;
    disabled?: boolean;
}

export default function caixaPlacar({casaOuVisitante, value, onChange, disabled = false}: CaixaPlacarProps) {
    return (
        <div className="flex flex-col gap-1 justify-center items-center">
            <span className="text-xs text-cinzaSuave">Predict</span>
            <input
                type="text"
                inputMode="numeric"
                required
                name={`placar-${casaOuVisitante}`}
                value={value === null ? "" : String(value)}
                disabled={disabled}
                className="w-11 bp-540:w-13 aspect-square bg-azulEscuro rounded-lg text-verdeNeon text-center text-xl bp-540:text-2xl border border-verdeNeon/35 focus:outline-none focus:ring-1 focus:ring-verdeNeon/50 focus:border-verdeNeon/50 placeholder:text-cinzaSuave focus:placeholder-transparent disabled:opacity-70"
                placeholder="?"
                autoComplete="off"
                onInput={(event) => {
                    const rawValue = (event.target as HTMLInputElement).value.replace(/\D/g, "")
                    onChange(rawValue === "" ? null : parseInt(rawValue, 10));
                }}
                maxLength={2}
            />
        </div>
    );
}