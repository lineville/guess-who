import WebSocket from "ws";
import { IncomingMessage } from "http";

function createWebSocketServer() {
  const wss = new WebSocket.Server({ port: 8080 }); // TODO add host to env
  console.log("WebSocket server listening on port 8080");

  const gameStates: { [gameId: string]: any } = {};
  const connections: { [gameId: string]: { [clientId: string]: WebSocket } } = {};

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    // Get the gameId and clientId from the websocket request
    const [gameId, clientId] = (req.url as string).split(":");

    // Create a new empty gameState if none exists
    if (!gameStates[gameId]) {
      console.log(`New game created with gameId: ${gameId}`);
      gameStates[gameId] = initializeGameState();
      connections[gameId] = {};
    }

    // Add this session and client connection
    connections[gameId][clientId] = ws;

    ws.on("message", (message: string) => {
      console.log(`Received message: ${message}`);
      const data = JSON.parse(message);
      switch (data.type) {

        case "ask": {
          gameStates[gameId] = updateGameState(gameStates[gameId], clientId);
          broadcastGameState({ type: 'ask', ...gameStates[gameId] }, connections[gameId]);
          break;
        }
        default:
          console.warn(`Unknown message type: ${data.type}`);
      }

      console.log(gameStates);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      // Remove this WebSocket instance from the connections object
      delete connections[gameId][clientId];
    
      // If there are no more clients in this session, remove the session
      if (Object.keys(connections[gameId]).length === 0) {
        delete connections[gameId];
      }
    });
  });
}

function initializeGameState() {
  return { winner: null };
}

function updateGameState(gameState: any, clientId: any) {
  gameState.winner = clientId;
  return gameState;
}

function broadcastGameState(gameState: any, clients: { [clientId: string]: WebSocket }) {
  Object.keys(clients).forEach((clientId) => {
    const client = clients[clientId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(gameState));
    }
  });
}

createWebSocketServer();
