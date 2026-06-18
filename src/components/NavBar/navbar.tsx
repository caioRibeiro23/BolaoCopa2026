'use client'

import { logoutAction } from "@/src/lib/supabase/auth-actions";
import { ChevronDown, Menu, Star, User, LogOut, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/meusTorneios", label: "Torneios" },
  { href: "/regras", label: "Regras" },
  { href: "/extra", label: "Extra" }
];

type NavBarProps = {
  userData?: {
    name?: string;
    pts?: number;
    avatarUrl?: string;
  }
}

export default function NavBar({ userData }: NavBarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const currentUser = userData;
  
  const userAvatar = currentUser?.avatarUrl || "/copa.png";
  
  return (
    <header className="sticky top-0 left-0 right-0 z-20 bg-azulMedio border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-3">
          
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/navbar2.png"
              alt="Logo do site"
              width={200}
              height={100}
              className="object-contain"
              priority
            />
          </Link>

          {/* DESKTOP: Menu de Links (Visível apenas em lg:) */}
          <div className="hidden lg:flex gap-8 items-center">
            {links.map((link, index) => (
              <Link href={link.href} key={index}>
                <span className="text-base border border-transparent font-semibold hover:bg-[#39FF141A] hover:border hover:border-[#39FF1440] text-cinzaSuave hover:text-verdeNeon px-4 py-3 transition-all duration-300 rounded-lg">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* MOBILE & TABLET: Botão Hambúrguer (Visível até lg:) */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={toggleNav} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-verdeNeon focus:outline-none transition-colors"
            >
              {isNavOpen ? (
                <X className="w-9 h-9 transition-all" />
              ) : (
                <Menu className="w-9 h-9 transition-all" />
              )}
            </button>
          </div>

          {/* DESKTOP: Informações de Perfil (Visível apenas em lg:) */}
          <div className="hidden lg:flex gap-8 items-center">
            <div className="flex bg-[#FFD7001F] p-3 gap-2 rounded-full border border-[#FFD70066] outline outline-verdeNeon">
              <Star color="#FFD700" fill="#FFD700"/>
              <span className="text-[#FFD700] font-bold drop-shadow-[0_2px_4px_rgba(255,215,0,0.25)]">{userData?.pts ?? 0} pts</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex items-center gap-3 bg-[#1F2937] border border-gray-700 hover:border-gray-500 hover:cursor-pointer px-3 py-1.5 rounded-full transition-all text-white focus:outline-none"
              >
                <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full border border-gray-600 bg-white">
                  <Image src={userAvatar} alt="Perfil" fill className="object-cover" />
                </div>
                <span className="font-medium text-sm">{currentUser?.name || "Jogador"}</span>
                <ChevronDown size={16} className={`transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSelectOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <Link href="/perfil">
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#39FF141A] hover:text-verdeNeon transition-colors hover:cursor-pointer">
                      Meu Perfil
                    </button>
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-gray-700 hover:cursor-pointer">
                      Sair
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* MOBILE & TABLET: Menu Hambúrguer Aberto (Visível até lg:) */}
      {isNavOpen && (
        <div className="lg:hidden bg-azulMedio border-t border-gray-700 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-5 px-4 py-6">
            
            {/* Bloco de Perfil Dedicado dentro do Hambúrguer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1F2937]/50 p-4 rounded-2xl border border-gray-700/60 mb-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full border-2 border-gray-600 bg-white">
                  <Image src={userAvatar} alt="Perfil" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base">{currentUser?.name || "Jogador"}</span>
                  <Link 
                    href="/perfil" 
                    onClick={() => setIsNavOpen(false)}
                    className="text-xs text-verdeNeon hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <User size={12} />
                    Ver Meu Perfil
                  </Link>
                </div>
              </div>

              {/* Badge de pontos adaptado para o menu mobile/tablet */}
              <div className="flex bg-[#FFD7001F] px-4 py-2 gap-2 rounded-full border border-[#FFD70066] outline outline-verdeNeon items-center self-start sm:self-auto">
                <Star color="#FFD700" fill="#FFD700" size={16}/>
                <span className="text-[#FFD700] text-sm font-black tracking-wide">
                  {userData?.pts ?? 0} pts
                </span>
              </div>
            </div>

            <hr className="border-gray-700/40 my-1" />

            {/* Links de navegação normais */}
            <div className="flex flex-col gap-2">
              {links.map((link, index) => (
                <Link
                  href={link.href}
                  key={index}
                  onClick={() => setIsNavOpen(false)}
                  className="w-full"
                >
                  <span className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-lg font-semibold text-cinzaSuave transition-all duration-300 hover:bg-[#39FF141A] hover:text-verdeNeon border border-transparent hover:border-[#39FF1440]">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            <hr className="border-gray-700/40 my-1" />

            {/* Botão de Sair Mobile/Tablet */}
            <form action={logoutAction} onSubmit={() => setIsNavOpen(false)}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-lg font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/20"
              >
                <LogOut size={18} />
                Sair da Conta
              </button>
            </form>

          </div>
        </div>
      )}
    </header>
  );
}