"use client";

interface CaixaPlacarProps {
  casaOuVisitante: "casa" | "visitante";
    value: number | null;
    onChange: (val: number | null) => void;
    disabled?: boolean;
    isFinal?: boolean;
}

export default function caixaPlacar({casaOuVisitante, value, onChange, disabled = false, isFinal = false}: CaixaPlacarProps) {
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
                className={`w-11 bp-540:w-13 aspect-square bg-azulEscuro rounded-lg text-center text-xl bp-540:text-2xl border focus:outline-none focus:ring-1 placeholder:text-cinzaSuave focus:placeholder-transparent disabled:opacity-70 ${isFinal ? "text-[#ffd86b] border-[#8b6a1d]/35 focus:ring-1 focus:ring-[#8b6a1d]/50 focus:border-[#8b6a1d]/50" : "text-verdeNeon border-verdeNeon/35 focus:ring-1 focus:ring-verdeNeon/50 focus:border-verdeNeon/50"}`}
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