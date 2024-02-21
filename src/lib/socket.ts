import { io } from "socket.io-client";
import { GameType } from "./gameType";

const URL =
  process.env.AZURE_WEB_PUB_SUB_URL ||
  `https://web-pubsub-socket-free.webpubsub.azure.com`;

export const socket = (
  gameId: string,
  clientId: string,
  gameType: GameType = "default"
) => {
  return io(URL, {
    path: "/clients/socketio/hubs/Hub",
    query: { gameId: gameId, clientId: clientId, gameType: gameType },
  });
};
