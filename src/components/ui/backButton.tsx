"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
    label?: string;
    className?: string;
}

export default function BackButton({
    label = "Voltar",
    className = "",
}: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cinzaSuave transition-colors duration-200 hover:border-verdeNeon/40 hover:bg-white/10 hover:text-white ${className}`}
            aria-label="Voltar para a página anterior"
        >
            <span aria-hidden="true">←</span>
            {label}
        </button>
    );
}