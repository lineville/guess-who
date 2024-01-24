export default interface GameState {
  winner: string;
  myTurn: boolean;
  board: Character[];
  questions: [string, string][];
  yourCharacter: string;
}

interface Character {
  name: string;
  image: string;
  alive: boolean;
}