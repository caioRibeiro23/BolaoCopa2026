"use client"

import { sendEmailRecoveryPasswordAction } from "@/src/lib/supabase/recovery-password";
import { MailIcon } from "lucide-react";
import Image from "next/image";

export default function RecoveryAccessPage() {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        if(!email){
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        try{
            await sendEmailRecoveryPasswordAction(email);
            alert("Instruções de recuperação de senha enviadas para seu e-mail.");  
        } catch (e) {
            console.error("Erro ao enviar email de recuperação", e);
            const errorMessage = e instanceof Error ? e.message : "Erro desconhecido ao enviar email.";
            alert(errorMessage);
        }
    }

    return (
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter gap-5 ">
            <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
                <div className="flex w-full justify-center items-center gap-2">
                    <Image
                        src="/navbar2.png"
                        alt="Logo do site"
                        width={100}
                        height={100}
                    />
                </div>

                <div className="flex flex-col items-start gap-1 w-full">
                    <h1 className="font-bebas-neue text-lg bp-1024:text-2xl text-white">Recuperar acesso</h1>
                    <p className="text-white/45 text-xs bp-1024:text-sm">Insira seu e-mail para receber as instruções de recuperação de senha.</p>
                </div>
                <form className="w-full flex flex-col items-start gap-3.5" onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base text-white">E-mail</h3>
                        <div className="relative w-full">
                            <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Seu e-mail"
                                required
                                className="w-full rounded-lg bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 px-3 py-2 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors duration-300">
                        Enviar instruções
                    </button>
                </form>
            </div>
        </div>
    )
}