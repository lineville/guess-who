'use client';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react'
import { ArrowRightIcon } from '@chakra-ui/icons'

export default function Home() {
  const router = useRouter();

  const createGame = () => {
    localStorage.removeItem('yourCharacter');
    const gameId = uuidv4();
    router.push(`/game/${gameId}`);
  };

  return (
    <Button onClick={createGame} size='lg' colorScheme='teal' rightIcon={<ArrowRightIcon />}>New Game</Button>
  );
}
