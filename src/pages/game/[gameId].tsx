'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://localhost:8080'; // TODO - move to env

export default function Game() {
  const router = useRouter();
  const [gameId, setGameId] = useState<string | undefined>();
  const [clientId, setClientId] = useState<string | undefined>();
  const [gameState, setGameState] = useState({ winner: null });

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      const newClientId = uuidv4();
      localStorage.setItem('clientId', newClientId);
      setClientId(newClientId);
    }

    if (router.query.gameId) {
      setGameId(router.query.gameId as string);
    }
  }, [router.query.gameId]);

  const { sendJsonMessage } = useWebSocket(gameId && clientId ? `${WS_URL}/${gameId}:${clientId}` : null, {
    onOpen: () => {
      console.log(`Connected to WebSocket server at ${WS_URL}/${gameId}:${clientId}`);
    },
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log('Received:', data)

      switch (data.type) {
        case 'ask':
          setGameState({...gameState, winner: data.winner})
          break;
        case 'eliminate':
          // TODO - handle eliminate
          break;
        case 'guess':
          // TODO - handle guess
          break;
        default:
          console.warn('Unknown message type', data.type);
      }
    },
    onClose: () => { 
      console.log('Disconnected from WebSocket server');
      router.push("/")
    },
    shouldReconnect: (_closeEvent) => true,
  });

  const handleAskQuestion = () => {
    sendJsonMessage({ type: 'ask', message: 'Is your person a man or a woman?' })
  }

  return (
    <>
      <h2>Guess Who New Game!</h2>
      <p>Client Id: {clientId}</p>
      <button onClick={handleAskQuestion}>I win</button>
      <p>Winner: {gameState.winner}</p>
    </>
  );
}

// Client Actions

// Create New Game
// Ask a question (string, clientId)
// Eliminate characters ([character], clientId)
// Make a guess (character, clientId)