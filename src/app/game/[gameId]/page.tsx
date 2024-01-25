'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher-js';
import Message from '@/message';
import Board from '@/components/Board';
import Image from 'next/image'
import Character from '@/character';
import { Text, Box, Card, CardBody, CardHeader, Flex, Center } from '@chakra-ui/react';

// TODO Bind different handlers to different events
// TODO secure pusher channel using private channel
// TODO implement user actions

// Create New Game
// Ask a question (string, clientId)
// Flip characters ([character], clientId)
// Make a guess (character, clientId)

const ROWS = 4;
const COLUMNS = 6;

const characters = ['Abi', 'Ang', 'Anna', 'Boris', 'Carl', 'Chimezi', 'Colin', 'Emily', 'Gwen', 'Guadalupe', 'Imani', 'Jada', 'Jing', 'Kai', 'Karen', 'Kevin', 'Kiki', 'Liza', 'Len', 'Lucy', 'Manu', 'Marcus', 'Maria', 'Martha', 'Meryl', 'Pablo', 'Raquel', 'Robert', 'Samantha', 'Samir', 'Stew', 'Sue', 'Tonto', 'Trae', 'Wendell', 'Waru']

export default function Game() {
  const pathname = usePathname();
  const [gameId, setGameId] = useState((pathname as string).substring("/game/".length));
  const [clientId, setClientId] = useState('');
  const [winner, setWinner] = useState('');
  const [board, setBoard] = useState<Character[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [myTurn, setMyTurn] = useState(false);
  const [yourCharacter, setYourCharacter] = useState('');

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      const newClientId = uuidv4();
      localStorage.setItem('clientId', newClientId);
      setClientId(newClientId);
    }

    var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
    });

    const channelName = `${process.env.NEXT_PUBLIC_PUSHER_CHANNEL as string}-${gameId as string}`;
    var channel = pusher.subscribe(channelName);
    channel.bind('ask', function (data: Message) {
      // setGameState({ ...gameState, winner: data.clientId })
    });

    channel.bind('flip', function (data: Message) {
      setBoard(board.map((c, index) => index === parseInt(data.message, 10) ? { ...c, alive: !c.alive } : c))
    });


    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [clientId, board, gameId]);

  useEffect(() => {
    const storedCharacter = localStorage.getItem('yourCharacter');
    if (storedCharacter) {
      setYourCharacter(storedCharacter);
    } else {
      const randomIndex = Math.floor(Math.random() * characters.length);
      localStorage.setItem('yourCharacter', characters[randomIndex]);
      setYourCharacter(characters[randomIndex]);
    }

  }, []);

  useEffect(() => {
    const randomSubsetOfCharacters = shuffleArray(characters).slice(0, ROWS * COLUMNS);
    setBoard(randomSubsetOfCharacters.map((name: string) => ({ name, image: `/${name}.png`, alive: true })));
  }, []);

  const handleClickCharacter = (index: number) => {
    postMessage({
      event: 'flip',
      message: `${index}`,
      clientId,
      gameId
    })
  }

  return (
    <Center>

      <Flex style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

        <Box style={{ position: 'absolute', top: '5%', right: '5%' }}>
          {yourCharacter && (
            <Card style={{ borderRadius: '8px' }}>
              <CardHeader>
                <Text>You are {yourCharacter}</Text>
              </CardHeader>
              <CardBody>
                <Image src={yourCharacter ? `/${yourCharacter}.png` : ''} alt={yourCharacter} width={140} height={140} />
              </CardBody>
            </Card>
          )}
        </Box>

        <Box style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: '10%' }}>
          <Board board={board} handleClickCharacter={handleClickCharacter} rows={ROWS} columns={COLUMNS} />
        </Box>
      </Flex>
    </Center>
  );
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
