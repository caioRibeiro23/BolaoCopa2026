import Link from "next/link";
import FullGeneralTable from "@/src/components/Stats/FullGeneralTable/fullGeneralTable";
import FullChampionshipTable from "@/src/components/Stats/FullChampionshipTable/fullChampionshipTable";
import TitlePage from "@/src/components/ui/titlepage";
import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

interface FullTablePageProps {
  searchParams: Promise<{ championshipId?: string }>;
}

export default async function FullTablePage({ searchParams }: FullTablePageProps) {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { championshipId } = await searchParams;
  
  const isGeneralChampionship = championshipId === "general";

  return (
    <div className="w-full min-h-screen px-8 py-16 md:px-14 md:py-17 flex flex-col gap-8 bg-azulEscuro">
      
      {/* Botão Voltar Minimalista */}
      <div className="flex items-center">
        <Link
          href={`/torneio?championshipId=${championshipId || "general"}`}
          className="flex items-center gap-2 text-xs font-inter uppercase tracking-wider text-cinzaSuave/60 hover:text-verdeNeon transition-colors duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Voltar
        </Link>
      </div>

      <TitlePage title="Classificação Completa" />
      
      {/* Lógica condicional para renderizar a tabela correta */}
      {isGeneralChampionship ? (
        <FullGeneralTable 
          userId={user.id} 
          championshipId={championshipId || "general"} 
        />
      ) : (
        <FullChampionshipTable 
          userId={user.id} 
        />
      )}
    </div>
  );
}