"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cinzaSuave transition-colors duration-200 hover:border-verdeNeon/40 hover:bg-white/10 hover:text-white"
            aria-label="Voltar para a página anterior"
        >
            <span aria-hidden="true">←</span>
            Voltar
        </button>
    );
}