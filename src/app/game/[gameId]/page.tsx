'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Board from '@/components/Board';
import Image from 'next/image'
import Character from '@/character';
import { Text, Box, Card, CardBody, CardHeader, Flex, Center, CardFooter } from '@chakra-ui/react';
import { socket } from '@/socket';
import { Socket } from 'socket.io-client';

// TODO Finish implementing user actions

const COLUMNS = 6;
const ROWS = 4;

export default function Game() {

  const pathname = usePathname();
  const [winner, setWinner] = useState('');
  const [board, setBoard] = useState<Character[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [myTurn, setMyTurn] = useState(false);
  const [yourCharacter, setYourCharacter] = useState('');
  const [opponentRemainingCharacters, setOpponentRemainingCharacters] = useState<number>(COLUMNS * ROWS);

  const [socketConnection, setSocketConnection] = useState<Socket>();
  const [events, setEvents] = useState<string[]>([]);

  // Hook that handles the socket connection
  useEffect(() => {
    const gameId = (pathname as string).substring("/game/".length);
    const newSocket = socket(gameId);
    setSocketConnection(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [pathname]);

  // Hook that handles all the websocket events
  useEffect(() => {
    socketConnection?.on('init', (data: any) => {
      console.log(data);
      setYourCharacter(data.yourCharacter);
      setBoard(data.characters.map((name: string) => ({ name, image: `/${name}.png`, alive: true })));
      setQuestions(data.messageFeed);
      setMyTurn(data.turn === data.yourCharacter);
      setWinner(data.winner);
    })

    socketConnection?.on('eliminate', () => {
      setOpponentRemainingCharacters(prev => prev - 1)
    });

    socketConnection?.on('revive', () => {
      setOpponentRemainingCharacters(prev => prev + 1)
    });

  }, [socketConnection]);

  // Update our local board, and send the event to the server to update opponents counter
  const handleClickCharacter = (index: number) => {
    socketConnection?.emit(board[index].alive ? 'eliminate' : 'revive');
    setBoard(board.map((character, i) => {
      if (i === index) {
        return { ...character, alive: !character.alive };
      }
      return character;
    }));
  }

  return (
    <Center>
      <Flex style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Box style={{ position: 'absolute', top: '5%', right: '3%' }}>
          {yourCharacter && (
            <Card size="lg">
              <CardHeader display="flex" alignItems="center" justifyContent="center">
                <Text>You are {yourCharacter}</Text>
              </CardHeader>
              <CardBody>
                <Image src={yourCharacter ? `/${yourCharacter}.png` : ''} alt={yourCharacter} width={140} height={140} />
              </CardBody>
              <CardFooter>
                <Text>Opponent has {opponentRemainingCharacters} characters remaining</Text>
              </CardFooter>
            </Card>
          )}
        </Box>

        <Box style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: '10%' }}>
          <Board board={board} handleClickCharacter={handleClickCharacter} columns={COLUMNS} />
        </Box>
      </Flex>
    </Center >
  );
}