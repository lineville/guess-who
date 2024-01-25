'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';
import Message from '@/message';
import GameState, { Character } from '@/gameState';
import Board from '@/components/Board';
import Image from 'next/image'

// TODO Bind different handlers to different events
// TODO secure pusher channel using private channel
// TODO get AI generated images
// TODO implement user actions

// Create New Game
// Ask a question (string, clientId)
// Eliminate characters ([character], clientId)
// Make a guess (character, clientId)

// const BOARD_SIZE = 36;

const characters = ['Abi', 'Ang', 'Anna', 'Chimezi', 'Dolores', 'Emily', 'Gwen', 'Imani', 'Jing', 'Kai', 'Kevin', 'Kiki', 'Liza', 'Lucy', 'Manu', 'Maria', 'Meryl', 'Raquel', 'Robert', 'Samantha', 'Samir', 'Stew', 'Sue', 'Tonto', 'Waru']

export default function Game() {
  const router = useRouter();
  const [gameId, setGameId] = useState('');
  const [clientId, setClientId] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    winner: '',
    board: characters.map((name: string) => ({ name, image: `/${name}.png`, alive: true })),
    questions: [],
    myTurn: false,
    yourCharacter: ''
  });

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

    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
    });

    const channelName = `${process.env.NEXT_PUBLIC_PUSHER_CHANNEL as string}-${gameId as string}`;
    var channel = pusher.subscribe(channelName);
    channel.bind('ask', function (data: Message) {
      setGameState({ ...gameState, winner: data.clientId })
    });

    channel.bind('eliminate', function (data: Message) {
      setGameState({ ...gameState, board: gameState.board.map((c, index) => index === parseInt(data.message, 10) ? { ...c, alive: false } : c) })
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [router.query.gameId, gameId, gameState]);

  useEffect(() => {
    const storedCharacter = localStorage.getItem('yourCharacter');
    if (storedCharacter) {
      setGameState({ ...gameState, yourCharacter: storedCharacter });
    } else {
      const randomIndex = Math.floor(Math.random() * characters.length);
      localStorage.setItem('yourCharacter', characters[randomIndex]);
      setGameState({ ...gameState, yourCharacter: characters[randomIndex] });
    }
  }, []); // Empty dependency array

  const handleClickCharacter = (index: number) => {
    postMessage({
      event: 'eliminate',
      message: `${index}`,
      clientId,
      gameId
    })
  }

  const generateImages = async () => {

    fetch('/api/images')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate images');
        }
        return response.json();
      })
      .then(data => {
        console.log('Generated images:', data);
        // setGameState({
        //   ...gameState,
        //   board: [...gameState.board, data.map((url: string) => ({
        //     name: 'Name',
        //     image: url,
        //     alive: true
        //   }))],
        // });
      })
      .catch(error => {
        console.error('Failed to generate images:', error);
      });
  }

  return (
    <>
      <h2 style={{ display: 'flex', justifyContent: 'center' }}>Guess Who?</h2>
      <button onClick={generateImages}>Generate Images</button>
      {gameState.yourCharacter && <div>
        <span>You are</span>
        <Image src={gameState.yourCharacter ? `/${gameState.yourCharacter}.png` : ''} alt="character" width={120} height={120} />

      </div>}
      <Board gameState={gameState} handleClickCharacter={handleClickCharacter} />
    </>
  );
}


const postMessage = async (message: Message) => {
  const res = await fetch('/api/pusher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    console.error('failed to push data');
  }
}
