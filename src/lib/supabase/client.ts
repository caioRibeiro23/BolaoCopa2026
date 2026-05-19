import { createBrowserClient } from '@supabase/ssr'

interface WindowWithSupabase extends Window {
  __supabaseBrowserClient: ReturnType<typeof createBrowserClient>;
}

export function createClient() {
  // 1. Se estiver rodando no Servidor (SSR), cria uma instância rápida
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }

  // 2. Se estiver no Navegador, prende a instância no objeto global 'window'
  const globalWindow = window as unknown as WindowWithSupabase;

  if (!globalWindow.__supabaseBrowserClient) {
    globalWindow.__supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  return globalWindow.__supabaseBrowserClient;
}