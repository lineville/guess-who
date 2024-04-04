"use client";

import Game from "@/components/Game";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    const clientId = localStorage.getItem("clientId");
    if (!clientId) {
      localStorage.setItem("clientId", uuidv4());
    }
    setClientId(localStorage.getItem("clientId") as string);
  }, []);

  return clientId && <Game clientId={clientId} />;
}
