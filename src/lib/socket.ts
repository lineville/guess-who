import { io } from "socket.io-client";
import { GameType } from "./gameType";
import { GameMode } from "./gameMode";

const URL =
  process.env.AZURE_WEB_PUB_SUB_URL ||
  `https://web-pubsub-socket-free.webpubsub.azure.com`;

export const socket = (
  gameId: string,
  clientId: string,
  gameType: GameType = GameType.Pixar,
  gameMode: GameMode = GameMode.MultiPlayer
) => {
  return io(URL, {
    path: "/clients/socketio/hubs/Hub",
    query: {
      gameId: gameId,
      clientId: clientId,
      gameType: gameType.toString(),
      gameMode: gameMode.toString(),
    },
  });
};
