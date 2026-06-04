"use client"

import { translateSupabaseError } from "@/src/utils/supabase-errors";
import { createClient } from "@/src/lib/supabase/client";
import { Eye, EyeOff, LockKeyhole, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/

export default function RecoveryPasswordPage() {

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [pending, setPending] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({
        password: "",
        confirmPassword: "",
    })

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
        setError("");
        setSuccess("");
        setFieldErrors({ password: "", confirmPassword: "" });
        setPending(true);
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        
        if(!password || !confirmPassword){
            setFieldErrors({
                password: password ? "" : "Informe uma nova senha.",
                confirmPassword: confirmPassword ? "" : "Confirme sua nova senha.",
            });
            setError("Revise os campos destacados antes de continuar.");
            setPending(false);
            return;
        }

        if (password.length < 8 || !passwordRegex.test(password)) {
            setFieldErrors({
                password: "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
                confirmPassword: "",
            });
            setError("A senha ainda não atende aos requisitos mínimos.");
            setPending(false);
            return
        }

        if(password !== confirmPassword){
            setFieldErrors({
                password: "",
                confirmPassword: "As senhas não coincidem.",
            });
            setError("As senhas não coincidem. Verifique e tente novamente.");
            setPending(false);
            return;
        }

        try{
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            console.log('[recovery-password] session at submit:', session);

            if (!session) {
                setError("Não encontramos uma sessão válida. Abra novamente o link enviado por e-mail e tente outra vez.");
                setPending(false);
                return;
            }

            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setError(translateSupabaseError(error));
                setPending(false);
                return;
            }

            setSuccess("Senha alterada com sucesso. Você será redirecionado para o login em instantes.");
            setPending(false);
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (e) {
            console.error("Erro ao redefinir senha", e);

            const errorMessage = e instanceof Error ? e.message : "Erro desconhecido ao redefinir senha.";
            setError(errorMessage);
            setPending(false);
        }
    }

  return (
    <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center min-h-screen font-inter gap-5 py-10">
        <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6 backdrop-blur-md">
            <div className="flex w-full justify-center items-center gap-2">
                <Image
                    src="/navbar2.png"
                    alt="Logo do site"
                    width={180}
                    height={100}
                />
            </div>
            <div className="flex flex-col items-start gap-1 w-full">
                <h1 className="font-bebas-neue text-lg bp-1024:text-2xl text-white">Redefinir Senha</h1>
                <p className="text-white/45 text-xs bp-1024:text-sm">Insira sua nova senha abaixo</p>
            </div>
            <form className="w-full flex flex-col items-start gap-4" onSubmit={handleSubmit}>
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
                    <h3 className="text-sm bp-1024:text-base text-white">Senha</h3>
                    <div className="relative w-full">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                        <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha segura"
                        required
                        aria-invalid={Boolean(fieldErrors.password)}
                        className={`w-full rounded-[10px] py-3 bp-1024:py-4 pl-12 pr-12 bg-transparent text-white placeholder-[#757575] focus:outline-none focus:ring-2 transition-all duration-200 ${fieldErrors.password ? "border border-red-500/50 focus:ring-red-500/20" : "border border-[#FFFFFF]/12 focus:ring-verdeNeon/30 focus:border-verdeNeon/30"}`}
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <p className="text-xs text-red-300 leading-relaxed">{fieldErrors.password}</p>
                    )}
                </div>
                <div className="w-full flex flex-col gap-1 items-start">
                    <h3 className="text-sm bp-1024:text-base text-white">Confirmar Senha</h3>
                    <div className="relative w-full">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                        <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        required
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        className={`w-full rounded-[10px] py-3 bp-1024:py-4 pl-12 pr-12 bg-transparent text-white placeholder-[#757575] focus:outline-none focus:ring-2 transition-all duration-200 ${fieldErrors.confirmPassword ? "border border-red-500/50 focus:ring-red-500/20" : "border border-[#FFFFFF]/12 focus:ring-verdeNeon/30 focus:border-verdeNeon/30"}`}
                        />
                        <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                        <p className="text-xs text-red-300 leading-relaxed">{fieldErrors.confirmPassword}</p>
                    )}
                </div>
                <button type="submit" disabled={pending} className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-3 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                    {pending && <Loader2 size={20} className="animate-spin" />}
                    {pending ? "Redefinindo..." : "Redefinir senha"}
                </button>
            </form>
        </div>
    </div>
  )
}