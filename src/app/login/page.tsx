'use client'

import { LockKeyhole, MailIcon, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    return(
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter gap-5 ">
            <div className="w-11/12 md:w-7/12  bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
                <div className="flex flex-col items-start gap-1 w-full">
                    <h1 className="font-bebas-neue text-lg bp-1024:text-2xl">Entrar na sua conta</h1>
                    <p className="text-white/45 text-xs bp-1024:text-sm">Bem vindo! Faça login para continuar</p>
                </div>
               <div className="w-full flex flex-col items-start gap-3.5">
                    <div className="w-full flex flex-col gap-1 items-start">
                        <h3 className="text-sm bp-1024:text-base">E-mail</h3>
                        <div className="relative w-full">
                            <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input 
                                type="email" 
                                placeholder="seuemail@exemplo.com" 
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-1 items-start">
                        <div className="w-full flex justify-between items-center">
                            <h3 className="text-sm bp-1024:text-base">Senha</h3>
                            <Link href="#" className="text-xs bp-1024:text-xs text-verdeNeon font-medium cursor-pointer hover:underline">Esqueci minha senha</Link>
                        </div>
                        <div className="relative w-full">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Digite sua senha" 
                                className="w-full rounded-[10px] py-2 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-[#757575] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]/20 focus:border-[#FFFFFF]/20"
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
               </div>
               <button className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-2 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-101 active:scale-95">
                        Entrar no bolão
                </button>
                <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">Ainda não tem uma conta? <Link href="#" className="text-verdeNeon font-medium hover:underline">Cadastre-se grátis!</Link></p>
            </div>
        </div>
    )
}

