'use client'

import { logoutAction } from "@/src/lib/supabase/auth-actions";
import { User } from "@supabase/supabase-js";
import { ChevronDown, Menu, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/", label: "Classificação" },
  { href: "/stats", label: "Histórico" }
];

type NavBarProps = {
  userData?: {
    name?: string
    pts?: number
  }
}

export default function NavBar({ userData }: NavBarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const currentUser = userData;
  
  return (
    <header className="sticky top-0 left-0 right-0 z-20 bg-azulMedio border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-3">
          
          <div className="shrink-0 flex items-center bg-white p-2 rounded-full">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/copa.png"
                alt="Logo do site"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            {links.map((link, index) => (
              <Link href={link.href} key={index}>
                <span className="text-base border border-transparent font-semibold hover:bg-[#39FF141A] hover:opacity-25% hover:border hover:border-[#39FF1440] text-cinzaSuave hover:text-verdeNeon px-4 py-3 transition-all duration-300 rounded-lg">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleNav} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-500 focus:outline-none"
            >
              {isNavOpen ? (
                <X className="w-10 h-10 transition-all" />
              ) : (
                <Menu className="w-10 h-10 transition-all" />
              )}
            </button>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <div className="flex bg-[#FFD7001F] p-3 gap-2 rounded-full border border-[#FFD70066] outline outline-verdeNeon">
              <Star color="#FFD700" fill="#FFD700"/>
              <span className="text-[#FFD700] font-bold drop-shadow-[0_2px_4px_rgba(255,215,0,0.25)]">{userData?.pts ?? 0} pts</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex items-center gap-3 bg-[#1F2937] border border-gray-700 hover:border-gray-500 hover:cursor-pointer px-3 py-1.5 rounded-full transition-all text-white focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 bg-white">
                  <Image
                    src="/copa.png"
                    alt="Perfil"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-sm">{currentUser?.name}</span>
                <ChevronDown size={16} className={`transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSelectOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#39FF141A] hover:text-verdeNeon transition-colors">
                    Meu Perfil
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#39FF141A] hover:text-verdeNeon transition-colors border-t border-gray-700">
                    Configurações
                  </button>
                  <form action={logoutAction}>
                    <button type="submit" className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-gray-700">
                      Sair
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {isNavOpen && (
        <div className="md:hidden bg-azulMedio border-t border-gray-700 transition-all duration-300 ease-in-out">
          <div className="flex flex-col items-stretch gap-3 px-4 py-6">
            {links.map((link, index) => (
              <Link
                href={link.href}
                key={index}
                onClick={() => setIsNavOpen(false)}
                className="w-full"
              >
                <span className="flex w-full items-center justify-center rounded-2xl px-6 py-3 text-xl font-semibold text-cinzaSuave transition-all duration-300 hover:bg-purple-500 hover:text-white">
                  {link.label}
                </span>
              </Link>
            ))}
            <form action={logoutAction} className="pt-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-2xl px-6 py-3 text-xl font-semibold text-red-300 transition-all duration-300 hover:bg-red-500/10 hover:text-red-200"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}