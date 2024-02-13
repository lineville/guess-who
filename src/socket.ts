import { io } from "socket.io-client";

const URL =
  process.env.AZURE_WEB_PUB_SUB_URL ||
  `https://web-pubsub-socket-free.webpubsub.azure.com`;

export const socket = (gameId: string, clientId: string) => {
  return io(URL, {
    path: "/clients/socketio/hubs/Hub",
    query: { gameId: gameId, clientId: clientId },
  });
};
