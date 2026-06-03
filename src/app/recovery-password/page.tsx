"use client"

import { createClient } from "@/src/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RecoveryPasswordPage() {

    const router = useRouter();

    useEffect(() => {
    async function checkSession() {
        const supabase = createClient();

        // If a code is present in the URL (forwarded from /auth/confirm),
        // perform the exchange in the browser so the PKCE verifier
        // (stored in localStorage) is available.
        try {
            const url = new URL(window.location.href);
            const code = url.searchParams.get('code');
            if (code) {
                console.log('[recovery-password] found code in URL, exchanging on client');
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                console.log('[recovery-password] exchangeCodeForSession result', error);

                // Remove code from URL for cleanliness
                url.searchParams.delete('code');
                window.history.replaceState({}, document.title, url.pathname + url.search);
            }
        } catch (err) {
            console.error('[recovery-password] error during client exchange', err);
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();

        console.log('[recovery-password] session after exchange:', session);
    }

    checkSession();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        if(!password || !confirmPassword){
            alert("Por favor, preencha ambos os campos de senha.");
            return;
        }
        if(password !== confirmPassword){
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return;
        }
        try{
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            console.log('[recovery-password] session at submit:', session);

            if (!session) {
                alert("Sessão de autenticação não encontrada. Volte ao link enviado por email e tente novamente.");
                return;
            }

            console.log('[recovery-password] attempting updateUser for new password');
            const { error, data } = await supabase.auth.updateUser({ password });
            console.log('[recovery-password] updateUser result:', { error, data });
            if (error) throw new Error(error.message);

            alert("Senha redefinida com sucesso! Você pode agora fazer login com sua nova senha.");
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (e) {
            console.error("Erro ao redefinir senha", e);

            const errorMessage = e instanceof Error ? e.message : "Erro desconhecido ao redefinir senha.";
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
                <h1 className="font-bebas-neue text-lg bp-1024:text-2xl text-white">Redefinir Senha</h1>
                <p className="text-white/45 text-xs bp-1024:text-sm">Insira sua nova senha abaixo</p>
            </div>
            <form className="w-full flex flex-col items-start gap-3.5" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col gap-1 items-start">
                    <h3 className="text-sm bp-1024:text-base text-white">Senha</h3>
                    <div className="relative w-full">
                        <input
                            name="password"
                            type="password"
                            placeholder="Digite sua nova senha"
                            required
                            className="w-full rounded-lg bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col gap-1 items-start">
                    <h3 className="text-sm bp-1024:text-base text-white">Confirmar Senha</h3>
                    <div className="relative w-full">
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirme sua nova senha"
                            required
                            className="w-full rounded-lg bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors duration-300">
                    Redefinir Senha
                </button>
            </form>
        </div>
    </div>
  )
}