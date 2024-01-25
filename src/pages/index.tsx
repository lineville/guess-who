'use client'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const createGame = () => {
    localStorage.removeItem('yourCharacter');
    const gameId = uuidv4();
    router.push(`/game/${gameId}`);
  };
  
  return (
    <main>
      <h2>Guess Who</h2>
      <br />
      <button onClick={createGame}>Create New Game</button>
    </main>
  );
}
