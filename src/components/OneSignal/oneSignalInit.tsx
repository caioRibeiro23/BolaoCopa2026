"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit({ userId }: { userId: string }) {
  useEffect(() => {
    const initOneSignal = async () => {
      if (typeof window === "undefined") return;

      // 🎯 O PULOS DO GATO: Evita rodar o SDK se estiver no localhost de produção
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

        const playerId = await OneSignal.User.PushSubscription.id;
        
        if (playerId) {
          console.log("OneSignal Player ID capturado com sucesso:", playerId);
          // Aqui fica sua rota/função para atualizar o Supabase
        }

      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("already initialized")) {
          return;
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