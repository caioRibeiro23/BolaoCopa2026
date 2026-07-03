"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { createClient } from "../../lib/supabase/client"; // Ajuste o caminho para onde está seu arquivo de criação do cliente

export default function OneSignalInit({ userId }: { userId: string }) {
  useEffect(() => {
    const initOneSignal = async () => {
      if (typeof window === "undefined") return;

      const isLocalhost = 
        window.location.hostname === "localhost" || 
        window.location.hostname === "127.0.0.1";

      if (isLocalhost) {
        console.log("⚠️ OneSignal desativado localmente para evitar erro de domínio (https://www.bolaobolazzo.com.br).");
        return;
      }

      console.log("OneSignalInit executado para o usuário:", userId);
      if (!userId) {
        console.error("❌ Erro: O userId veio vazio no componente OneSignalInit.");
        return;
      }

      try {
        await OneSignal.init({
          appId: "af4ec315-ebaf-4bea-a5b2-62f225308278",
        });

        // 1. Exibe explicitamente o pedido de permissão nativo do navegador
        await OneSignal.Notifications.requestPermission();

        // Função responsável por sincronizar o token gerado com a tabela correta no Supabase
        const salvarNoSupabase = async (onesignalId: string) => {
          console.log("Tentando salvar no Supabase o ID:", onesignalId);
          const supabase = createClient();
          
          const { error } = await supabase
            .from("user_profiles")
            .update({ onesignal_player_id: onesignalId })
            .eq("id", userId);

          if (error) {
            console.error("❌ Erro no update do Supabase:", error.message);
          } else {
            console.log("✅ Sucesso! Player ID atualizado na tabela user_profiles.");
          }
        };

        // 2. Tenta capturar o player_id de forma imediata se ele já existir
        const currentId = OneSignal.User.PushSubscription.id;
        if (currentId) {
          await salvarNoSupabase(currentId);
        }

        // 3. Listener ativo para capturar o ID se ele demorar alguns segundos a mais para ser gerado
        OneSignal.User.PushSubscription.addEventListener("change", async (state) => {
          if (state.current.id) {
            console.log("🔄 Mudança de estado detectada. Novo ID:", state.current.id);
            await salvarNoSupabase(state.current.id);
          }
        });

      } catch (error: unknown) {
        // Tratamento seguro de erros sem usar 'any' para satisfazer o ESLint
        if (
          error && 
          typeof error === "object" && 
          "message" in error && 
          typeof (error as { message: unknown }).message === "string"
        ) {
          const errorMessage = (error as { message: string }).message;
          if (errorMessage.includes("already initialized")) {
            return;
          }
        }
        
        console.error("Erro ao configurar OneSignal:", error);
      }
    };

    initOneSignal();
  }, [userId]);

  return null;
}