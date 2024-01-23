'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';

// TODO Bind different handlers to different events
// TODO secure pusher channel using private channel
// TODO get AI generated images
// TODO implement user actions

// Create New Game
// Ask a question (string, clientId)
// Eliminate characters ([character], clientId)
// Make a guess (character, clientId)

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

  var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
  });

  var channel = pusher.subscribe(`${process.env.NEXT_PUBLIC_PUSHER_CHANNEL as string}-${gameId}`);
  channel.bind('ask', function (data: any) {
    setGameState({ ...gameState, winner: data.winner })
  });

  const handleAskQuestion = async () => {
    const res = await fetch('/api/pusher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event: 'ask', winner: clientId, gameId: gameId }),
    });
    if (!res.ok) {
      console.error('failed to push data');
    }
  }

  return (
    <>
      <h2>Guess Who New Game!</h2>
      <p>Client Id: {clientId}</p>
      <button onClick={handleAskQuestion}>I win</button>
      <p>{gameState.winner == clientId ? "You win" : "You lose"}</p>
    </>
  );
}