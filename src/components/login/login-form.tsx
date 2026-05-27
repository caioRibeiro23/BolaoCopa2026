'use client'

import { loginWithGoogle } from "@/src/lib/supabase/auth-actions"
import { LockKeyhole, MailIcon, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useActionState, useState } from "react"

type AuthActionState = {
  error: string
}

type LoginFormProps = {
  action: (previousState: AuthActionState, formData: FormData) => Promise<AuthActionState>
  registered?: boolean
}

const initialState: AuthActionState = { error: "" }

export default function LoginForm({ action, registered }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter gap-5 ">
      <div className="w-11/12 md:w-7/12 bp-1024:w-6/12 lg:w-4/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
        <div className="flex w-full justify-center items-center gap-2">
              <Image
                src="/navbar2.png"
                alt="Logo do site"
                width={200}
                height={100}
                className=" object-contain"
                priority
              />
          </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <h1 className="font-bebas-neue text-lg bp-1024:text-2xl text-white">Entrar na sua conta</h1>
          <p className="text-white/45 text-xs bp-1024:text-sm">Bem vindo! Faça login para continuar</p>
        </div>

        {registered && (
          <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
            <p className="text-emerald-100 text-xs">Conta criada com sucesso. Faça login para continuar.</p>
          </div>
        )}

        {state.error && (
          <div className="w-full bg-red-500/20 border border-red-500 rounded px-3 py-2">
            <p className="text-red-200 text-xs">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="w-full flex flex-col items-start gap-3.5">
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

          <div className="w-full flex flex-col gap-1 items-start">
            <div className="w-full flex justify-between items-center">
              <h3 className="text-sm bp-1024:text-base text-white">Senha</h3>
              <Link href="/forgot-password" className="text-xs bp-1024:text-xs text-verdeNeon font-medium cursor-pointer hover:underline">
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative w-full">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
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

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-linear-to-r from-verdeNeon to-[#22C55E] text-black font-bold py-2 bp-1024:py-4 px-6 rounded-[10px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-verdeNeon/10 hover:scale-101 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {pending && <Loader2 size={20} className="animate-spin" />}
            {pending ? "Entrando..." : "Entrar no bolão"}
          </button>
        </form>

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/40">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form action={loginWithGoogle} className="w-full">
          <button type="submit" className="w-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-[10px] py-2 bp-1024:py-4 px-6 flex items-center justify-center gap-3 cursor-pointer">
            <Image
              src="google-logo.svg"
              alt="Google"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            <span className="font-medium text-white">
              Entrar com Google
            </span>
          </button>
        </form>

        <p className="w-full text-xs bp-1024:text-sm text-white/40 text-center">
          Ainda não tem uma conta? <Link href="/register" className="text-verdeNeon font-medium hover:underline">Cadastre-se grátis!</Link>
        </p>
      </div>
    </div>
  )
}