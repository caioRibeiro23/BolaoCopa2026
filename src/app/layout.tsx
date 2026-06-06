import type { Metadata } from "next";
import { Bebas_Neue, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bolão Bolazzo",
  description:
    "Participe do Bolão Bolazzo da Copa do Mundo 2026 e teste seus palpites para os jogos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${roboto.variable} ${inter.variable} ${bebasNeue.variable} h-full antialiased`}
      suppressHydrationWarning // Evita que extensões que mexem no HTML quebrem o app
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        </body>
    </html>
  );
}