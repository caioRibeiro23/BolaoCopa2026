'use client'

import { createClient } from "@/lib/supabase/client"
import { LockKeyhole, MailIcon, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LoginDTO {
    email: string
    password: string
}

export default function LoginPage() {
    const [formData,setFormData] = useState<LoginDTO>({email: "", password: ""})
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })

            if (error) {
                setError(error.message)
                return
            }

            // Sucesso! Redirecionar para home
            router.push("/")
        } catch (err) {
            setError("Erro ao fazer login. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter gap-5 ">
            <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
                <div className="flex flex-col items-start gap-1 w-full">
                    <h1 className="font-bebas-neue text-lg bp-1024:text-2xl">Entrar na sua conta</h1>
                    <p className="text-white/45 text-xs bp-1024:text-sm">Bem vindo! Faça login para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="w-full flex flex-col items-start gap-3.5">
                    {/* Campo Email */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">E-mail</h3>
                        <div className="relative w-full">
                            <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                        </div>
                    </div>

                    {/* Campo Senha */}
                    <div className="w-full flex flex-col gap-1 items-start">
                        <div className="w-full flex justify-between items-center">
                            <h3 className="text-sm bp-1024:text-base">Senha</h3>
                            <Link href="/forgot-password" className="text-xs bp-1024:text-xs text-verdeNeon font-medium cursor-pointer hover:underline">
                                Esqueci minha senha
                            </Link>
                        </div>
                        <div className="relative w-full">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                required
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pointer-events-auto cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="w-full bg-red-500/20 border border-red-500 rounded px-3 py-2">
                            <p className="text-red-200 text-xs">{error}</p>
                        </div>
                    )}

                    {/* Botão Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-2 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-101 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={20} className="animate-spin" />}
                        {loading ? "Entrando..." : "Entrar no bolão"}
                    </button>
                </form>

                {/* Link Cadastro */}
                <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">
                    Ainda não tem uma conta? <Link href="/register" className="text-verdeNeon font-medium hover:underline">Cadastre-se grátis!</Link>
                </p>
            </div>
        </div>
    )

    // return(
    //     <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter gap-5 ">
    //         <div className="w-11/12 md:w-7/12  bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
    //             <div className="flex flex-col items-start gap-1 w-full">
    //                 <h1 className="font-bebas-neue text-lg bp-1024:text-2xl">Entrar na sua conta</h1>
    //                 <p className="text-white/45 text-xs bp-1024:text-sm">Bem vindo! Faça login para continuar</p>
    //             </div>
    //            <div className="w-full flex flex-col items-start gap-3.5">
    //                 <div className="w-full flex flex-col gap-1 items-start">
    //                     <h3 className="text-sm bp-1024:text-base">E-mail</h3>
    //                     <div className="relative w-full">
    //                         <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
    //                         <input 
    //                             type="email" 
    //                             placeholder="seuemail@exemplo.com" 
    //                             className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
    //                         />
    //                     </div>
    //                 </div>
    //                 <div className="w-full flex flex-col gap-1 items-start">
    //                     <div className="w-full flex justify-between items-center">
    //                         <h3 className="text-sm bp-1024:text-base">Senha</h3>
    //                         <Link href="#" className="text-xs bp-1024:text-xs text-verdeNeon font-medium cursor-pointer hover:underline">Esqueci minha senha</Link>
    //                     </div>
    //                     <div className="relative w-full">
    //                         <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
    //                         <input 
    //                             type={showPassword ? "text" : "password"} 
    //                             placeholder="Digite sua senha" 
    //                             className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
    //                         />
    //                         <button
    //                             type="button"
    //                             onClick={() => setShowPassword(!showPassword)}
    //                             className="pointer-events-auto cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200"
    //                         >
    //                             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    //                         </button>
    //                     </div>
    //                 </div>
    //            </div>
    //            <button className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-2 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-101 active:scale-95">
    //                     Entrar no bolão
    //             </button>
    //             <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">Ainda não tem uma conta? <Link href="#" className="text-verdeNeon font-medium hover:underline">Cadastre-se grátis!</Link></p>
    //         </div>
    //     </div>
    // )
}

