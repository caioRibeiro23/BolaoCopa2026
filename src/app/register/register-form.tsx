'use client'

import { LockKeyhole, MailIcon, Eye, EyeOff, Loader2, User } from "lucide-react"
import Link from "next/link"
import { useActionState, useState } from "react"

type AuthActionState = {
  error: string
}

type RegisterFormProps = {
  action: (previousState: AuthActionState, formData: FormData) => Promise<AuthActionState>
}

const initialState: AuthActionState = { error: "" }

export default function RegisterForm({ action }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center min-h-screen font-inter gap-5 py-10">
      <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6 backdrop-blur-md">
        <div className="flex flex-col items-start gap-1 w-full">
          <h1 className="font-bebas-neue text-lg bp-1024:text-2xl">Criar sua conta</h1>
          <p className="text-white/45 text-xs bp-1024:text-sm">Junte-se ao bolão da Copa 2026!</p>
        </div>

        <form action={formAction} className="w-full flex flex-col items-start gap-4">
          {state.error && (
            <div className="w-full flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 animate-in fade-in duration-200">
              <p className="text-sm text-red-200 leading-relaxed">{state.error}</p>
            </div>
          )}

          <div className="w-full flex flex-col gap-1 items-start">
            <h3 className="text-sm bp-1024:text-base">Nome Completo</h3>
            <div className="relative w-full">
              <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
              <input
                name="fullName"
                type="text"
                placeholder="Seu nome completo"
                required
                className="w-full rounded-[10px] py-3 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-verdeNeon/30 focus:border-verdeNeon/30 transition-all duration-200"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 items-start">
            <h3 className="text-sm bp-1024:text-base">E-mail</h3>
            <div className="relative w-full">
              <MailIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
              <input
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                required
                className="w-full rounded-[10px] py-3 bp-1024:py-4 pl-12 pr-3 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-verdeNeon/30 focus:border-verdeNeon/30 transition-all duration-200"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 items-start">
            <h3 className="text-sm bp-1024:text-base">Senha</h3>
            <div className="relative w-full">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha segura"
                required
                className="w-full rounded-[10px] py-3 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-verdeNeon/30 focus:border-verdeNeon/30 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 items-start">
            <h3 className="text-sm bp-1024:text-base">Confirmar Senha</h3>
            <div className="relative w-full">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                required
                className="w-full rounded-[10px] py-3 bp-1024:py-4 pl-12 pr-12 bg-transparent border border-[#FFFFFF]/12 text-white placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-verdeNeon/30 focus:border-verdeNeon/30 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-3 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {pending && <Loader2 size={20} className="animate-spin" />}
            {pending ? "Criando conta..." : "Criar minha conta"}
          </button>
        </form>

        <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-verdeNeon font-medium hover:underline">
            Faça login!
          </Link>
        </p>
      </div>
    </div>
  )
}