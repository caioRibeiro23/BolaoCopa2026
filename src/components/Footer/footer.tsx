import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0b1220] px-8 py-10 backdrop-blur-sm md:px-14">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <div className="space-y-2 text-center lg:text-left">
                    <p className="font-inter text-xs font-bold uppercase tracking-[2px] text-verdeNeon">
                        Bolão Copa 2026
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Link href="/" className="transition-transform duration-300 hover:scale-[1.03]">
                        <Image
                            src="/navbar2.png"
                            alt="Logo do Bolão"
                            width={210}
                            height={84}
                            className="h-auto w-48 object-contain md:w-56"
                        />
                    </Link>
                </div>

                <div className="space-y-2 text-center lg:text-right">
                    <p className="font-inter text-xs font-bold uppercase tracking-[2px] text-verdeNeon">
                        Informações úteis
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-cinzaSuave">
                        <Link href="/meusTorneios" className="transition-colors hover:text-white">
                            Meus torneios
                        </Link>
                        <Link href="/regras" className="transition-colors hover:text-white">
                            Regras do bolão
                        </Link>
                        <Link href="/extra" className="transition-colors hover:text-white">
                            Extras e novidades
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-7xl border-t border-white/5 pt-4 text-center text-xs text-cinzaSuave">
                <p>Desenvolvido para organizar a competição, os palpites e a experiência dos participantes.</p>
            </div>
        </footer>
    );
}