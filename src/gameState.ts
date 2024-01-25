export default interface GameState {
  winner: string;
  myTurn: boolean;
  board: Character[];
  questions: [string, string][];
  yourCharacter: string;
}

export interface Character {
  name: string;
  image: string;
  alive: boolean;
}