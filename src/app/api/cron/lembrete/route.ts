import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos o Service Role Key aqui para ignorar o RLS e conseguir checar os palpites de todo mundo
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(request: Request) {
  // Proteção para garantir que só o seu agendador de tarefas chame essa rota em produção
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const agora = new Date();

    const daquiSetentaECincoMinutos = new Date(agora.getTime() + 75 * 60 * 1000);

    // 1. Busca os jogos que começam na janela de 1 hora a partir de agora
    const { data: matches } = await supabase
      .from('matches')
      .select('id, team_home, team_away, date_time')
      .gte('date_time', agora.toISOString()) 
      .lte('date_time', daquiSetentaECincoMinutos.toISOString());

    if (!matches || matches.length === 0) {
      return NextResponse.json({ message: "Nenhum jogo começando na próxima hora." });
    }

    for (const match of matches) {
      // 2. Busca os IDs dos usuários que já fizeram palpite para ESSE jogo
      const { data: palpitesFeitos } = await supabase
        .from('bets')
        .select('user_id')
        .eq('match_id', match.id);

      const idsUsuariosComPalpite = palpitesFeitos?.map(b => b.user_id) || [];

      // 3. Busca os perfis que têm Push ativo (onesignal_player_id) mas NÃO estão na lista acima
      const { data: usuariosEsquecidos } = await supabase
        .from('profiles') // Altere para 'user_profiles' se esse for o nome da tabela de metadados
        .select('onesignal_player_id')
        .not('onesignal_player_id', 'is', null)
        .not('id', 'in', `(${idsUsuariosComPalpite.length > 0 ? idsUsuariosComPalpite.join(',') : '""'})`);

      const playerIds = usuariosEsquecidos?.map(u => u.onesignal_player_id).filter(Boolean) as string[];

      if (playerIds && playerIds.length > 0) {
        // 4. Dispara a chamada para a API do OneSignal enviar a notificação
        await fetch('https://onesignal.com/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
          },
          body: JSON.stringify({
            app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            include_player_ids: playerIds,
            headings: { pt: "Falta pouco! ⏳" },
            contents: { pt: `O jogo ${match.team_home} x ${match.team_away} começa em 1 hora e você ainda não palpitou!` },
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/matches/${match.id}`
          })
        });
      }
    }

    return NextResponse.json({ success: true, message: "Lembretes processados com sucesso." });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}