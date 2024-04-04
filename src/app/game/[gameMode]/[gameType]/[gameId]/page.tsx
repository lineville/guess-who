"use client";

import Game from "@/components/Game";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GameMode } from "@/lib/gameMode";

export default function Page() {
  const [clientId, setClientId] = useState<string>("");
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MultiPlayer);

  useEffect(() => {
    const clientId = localStorage.getItem("clientId");
    if (!clientId) {
      localStorage.setItem("clientId", uuidv4());
    }
    setClientId(localStorage.getItem("clientId") as string);

    // Determine game mode based on URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === GameMode.SinglePlayer) {
      setGameMode(GameMode.SinglePlayer);
    }
  }, []);

  return clientId && <Game clientId={clientId} gameMode={gameMode} />;
}
