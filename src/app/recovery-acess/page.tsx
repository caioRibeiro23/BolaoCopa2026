"use client"

import { sendEmailRecoveryPasswordAction } from "@/src/lib/supabase/recovery-password";
import { Loader2, MailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function formatRecoveryError(message: string) {
    const normalized = message.toLowerCase();

    if (normalized.includes("invalid") || normalized.includes("válid")) {
        return "Por favor, informe um e-mail válido.";
    }

    if (normalized.includes("rate limit") || normalized.includes("muitas tentativas")) {
        return "Muitas tentativas de envio. Aguarde alguns minutos e tente novamente.";
    }

    return "Não foi possível enviar as instruções de recuperação. Tente novamente em instantes.";
}

export default function RecoveryAccessPage() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [pending, setPending] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setPending(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        if(!email){
            setError("Por favor, insira um e-mail válido.");
            setPending(false);
            return;
        }

        try{
            await sendEmailRecoveryPasswordAction(email);
            setSuccess("Instruções de recuperação de senha enviadas para seu e-mail.");
        } catch (e) {
            console.error("Erro ao enviar email de recuperação", e);
            const errorMessage = e instanceof Error ? e.message : "Erro desconhecido ao enviar email.";
            setError(formatRecoveryError(errorMessage));
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center min-h-screen font-inter gap-5 py-10 ">
            <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/80 border border-white/5 rounded-2xl flex flex-col items-start px-8 py-9 gap-5">
                <div className="w-full flex justify-start">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-white"
                    >
                        <span aria-hidden="true">←</span>
                        Voltar
                    </Link>
                </div>

                <div className="flex w-full justify-center items-center gap-2">
                    <Image
                        src="/navbar2.png"
                        alt="Logo do site"
                        width={180}
                        height={100}
                    />
                </div>

                <div className="flex flex-col items-start gap-1 w-full">
                    <h1 className="font-bebas-neue text-lg bp-1024:text-2xl text-white">Recuperar acesso</h1>
                    <p className="text-white/45 text-xs bp-1024:text-sm">Insira seu e-mail para receber as instruções de recuperação de senha.</p>
                </div>
                <form className="w-full flex flex-col items-start gap-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="w-full flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 animate-in fade-in duration-200">
                            <p className="text-sm text-red-100 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="w-full flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 animate-in fade-in duration-200">
                            <p className="text-sm text-emerald-100 leading-relaxed">{success}</p>
                        </div>
                    )}

                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base text-white">E-mail</h3>
                        <div className="relative w-full">
                        <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                        <input
                            name="email"
                            type="email"
                            placeholder="seuemail@exemplo.com"
                            required
                            className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                        />
                        </div>
                    </div>
                    <button type="submit" disabled={pending} className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-3 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {pending && <Loader2 size={20} className="animate-spin" />}
                        {pending ? "Enviando..." : "Enviar instruções"}
                    </button>
                </form>
            </div>
        </div>
    )
}