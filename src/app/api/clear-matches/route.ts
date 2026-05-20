import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Ou a sua service_role_key se tiver RLS ativado para delete
);

export async function GET() {
  try {
    // O filtro .neq('id', '00000000-0000-0000-0000-000000000000') 
    // é um truque para deletar tudo, já que o Supabase exige um filtro no delete por segurança.
    const { error } = await supabase
      .from('matches')
      .delete()
      .neq('team_home', 'valor_que_nao_existe'); 

    if (error) throw error;

    return NextResponse.json({ message: "Tabela matches limpa com sucesso!" });
  } catch (err: Error | unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}