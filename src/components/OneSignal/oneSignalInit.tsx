"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { createClient } from "../../lib/supabase/client"; // Ajuste relativo: src/components/OneSignal -> src/lib/supabase/client

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

      try {
        await OneSignal.init({
          appId: "af4ec315-ebaf-4bea-a5b2-62f225308278",
        });

        // 1. Abre o prompt nativo de permissão
        await OneSignal.Notifications.requestPermission();

        // 2. Pega o token único do dispositivo
        const playerId = OneSignal.User.PushSubscription.id;
        
        if (playerId) {
          console.log("OneSignal Player ID capturado:", playerId);
          
          // 🎯 Invoca a sua função para pegar a instância global do navegador
          const supabase = createClient();
          
          const { error } = await supabase
            .from("profiles")
            .update({ onesignal_player_id: playerId })
            .eq("id", userId);

          if (error) {
            console.error("Erro ao salvar o player_id no Supabase:", error.message);
          } else {
            console.log("Player ID atualizado com sucesso no banco!");
          }
        }

      } catch (error: unknown) {
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

    if (userId) {
      initOneSignal();
    }
  }, [userId]);

  return null;
}