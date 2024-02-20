import Message from "./message";

export default interface GameState {
  characters: string[];
  winner: string | null;
  turn: string;
  isAsking: boolean;
  dialogues: Message[];
  yourCharacter: string;
  eliminatedCharacters: number[];
}
