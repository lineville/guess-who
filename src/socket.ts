import { io } from 'socket.io-client';

const PORT = process.env.SOCKET_IO_PORT || 8010;
const URL = process.env.NODE_ENV === 'production' ? `https://guess-who-socket-server.vercel.app/${PORT}` : `http://localhost:${PORT}`;

export const socket = (gameId: string) => io(URL, { query: {gameId: gameId} });