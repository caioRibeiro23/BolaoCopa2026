import Link from "next/link";
import GeneralRow from "./generalRow";
import { getLeaderboard } from "@/src/lib/supabase/leaderboard";
import { createClient } from "@/src/lib/supabase/server";

const PLAYERS_PER_PAGE = 10;

export default async function GeneralTable({
    userId,
    championshipId,
    currentPage = 1,
}: {
    userId: string;
    championshipId: string;
    currentPage?: number;
}) {
    const players = await getLeaderboard();
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Lógica da Paginação Estrita
    const totalPages = Math.ceil(players.length / PLAYERS_PER_PAGE);
    const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
    const endIndex = startIndex + PLAYERS_PER_PAGE;
    
    const paginatedPlayers = players.slice(startIndex, endIndex);
    const currentUserPlayer = players.find((player) => player.user_id === userId);
    const isCurrentUserVisible = paginatedPlayers.some((player) => player.user_id === userId);

    return (
        <div className="flex flex-col bg-azulMedio rounded-2xl border border-azulCinzado w-full shadow-sm overflow-hidden">
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#FFFFFF]/2 ">
                <div className="text-[#FFD700] font-bebas-neue text-xl flex items-center gap-2">
                    <span>🏆</span>
                    <h2 className="drop-shadow-[0_0_8px_#FFD700]"> Tabela Geral</h2>
                </div>
                <span className="font-inter text-xs text-cinzaSuave">{players.length} jogadores</span>
            </div>
            
            <div className="flex flex-col divide-y divide-azulCinzado/10">
                {paginatedPlayers.map((player) => (
                    <GeneralRow
                        key={player.user_id}
                        position={player.position}
                        name={player.full_name}
                        shortName={player.username.slice(0, 2).toUpperCase()}
                        exactScores={player.exact_scores}
                        points={player.total_points}
                        isCurrentUser={player.user_id === userId}
                    />
                ))}
            </div>

            {!isCurrentUserVisible && currentUserPlayer && (
                <div className="border-t-2 border-dashed border-azulCinzado/40 bg-white/[0.02]">
                    <GeneralRow
                        position={currentUserPlayer.position}
                        name={currentUserPlayer.full_name}
                        shortName={currentUserPlayer.username.slice(0, 2).toUpperCase()}
                        exactScores={currentUserPlayer.exact_scores}
                        points={currentUserPlayer.total_points}
                        isCurrentUser={true}
                    />
                </div>
            )}

{/* 🌟 PAGINAÇÃO: APENAS NÚMERO ATUAL SUTIL */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-2 border-t border-azulCinzado/10 text-sm font-inter text-cinzaSuave bg-transparent select-none">
                    {/* Seta Anterior */}
                    <Link
                        href={`/tournament?championshipId=${championshipId}&page=${currentPage - 1}`}
                        scroll={false}
                        className={`p-1.5 rounded-lg text-cinzaSuave/60 hover:text-verdeNeon transition-colors duration-200 ${
                            currentPage <= 1 ? "pointer-events-none opacity-10" : ""
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </Link>

                    {/* Número Central Puro */}
                    <span className="text-xs font-semibold tracking-widest text-cinzaSuave/40">
                        <span className="text-white font-bold">{currentPage}</span>
                    </span>

                    {/* Seta Próxima */}
                    <Link
                        href={`/tournament?championshipId=${championshipId}&page=${currentPage + 1}`}
                        scroll={false}
                        className={`p-1.5 rounded-lg text-cinzaSuave/60 hover:text-verdeNeon transition-colors duration-200 ${
                            currentPage >= totalPages ? "pointer-events-none opacity-10" : ""
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            )}

            <div className="flex justify-center items-center px-5 py-4 bg-[#FFFFFF]/2 border-t border-azulCinzado/20">
                <Link href={`/tournament/fullTable?championshipId=${championshipId}`} className="text-cinzaSuave hover:underline text-sm font-inter">
                    Mostrar tabela completa
                </Link>
            </div>
        </div>
    )
}