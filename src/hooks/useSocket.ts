import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { socket } from "@/lib/socket";
import GameState from "@/lib/gameState";
import Message from "@/lib/message";
import { COLUMNS, ROWS } from "@/lib/constants";
import { GameType } from "@/lib/gameType";

export const useSocket = (clientId: string, gameType: GameType) => {
  const pathname = usePathname();
  const router = useRouter();

  const [socketConnection, setSocketConnection] = useState<Socket>();
  const [yourCharacter, setYourCharacter] = useState<string>("");
  const [board, setBoard] = useState<Array<any>>([]);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [dialogues, setDialogues] = useState<Message[]>([]);
  const [winner, setWinner] = useState("");
  const [isAsking, setIsAsking] = useState(true);
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [opponentReady, setOpponentReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [opponentRemainingCharacters, setOpponentRemainingCharacters] =
    useState<number>(COLUMNS * ROWS);
  const [yourRemainingCharacters, setYourRemainingCharacters] =
    useState<number>(COLUMNS * ROWS);

  // Hook that handles the socket connection
  useEffect(() => {
    const gameId = (pathname as string).substring("/game/".length);
    const newSocket = socket(gameId, clientId, gameType);
    setSocketConnection(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [pathname, clientId, gameType]);

  useEffect(
    () => setYourRemainingCharacters(board.filter((c) => c.alive).length),
    [board]
  );

  // Hook that handles all the websocket events
  useEffect(() => {
    socketConnection?.on("init", (data: GameState) => {
      const eliminatedChars = new Set(data.eliminatedCharacters);
      setYourCharacter(data.yourCharacter);
      setBoard(
        data.characters.map((name: string, idx: number) => ({
          name,
          image: `/${name}.png`,
          alive: !eliminatedChars.has(idx),
        }))
      );
      setIsMyTurn(data.turn === clientId);
      setDialogues(data.dialogues);
      setWinner(data.winner || "");
      setIsAsking(data.isAsking);
    });

    socketConnection?.on("turn", (userId: string) => {
      setIsMyTurn(userId === clientId);
    });

    socketConnection?.on("eliminate", (eliminatedIndexes: Set<number>) => {
      setBoard((prev) =>
        prev.map((c, index) => ({
          ...c,
          alive: !new Set(eliminatedIndexes).has(index),
        }))
      );
    });

    socketConnection?.on("revive", (eliminatedIndexes: Set<number>) => {
      setBoard((prev) =>
        prev.map((c, index) => ({
          ...c,
          alive: !new Set(eliminatedIndexes).has(index),
        }))
      );
    });

    socketConnection?.on("eliminated-count", (eliminatedCount: number) => {
      setOpponentRemainingCharacters(COLUMNS * ROWS - eliminatedCount);
    });

    socketConnection?.on("playerCount", (count: number) => {
      setPlayerCount(count);
    });

    socketConnection?.on("ask", (question: string) => {
      setDialogues((prev) => [...prev, { content: question, clientId: null }]);
      setIsMyTurn(true);
      setIsAsking(false);
    });

    socketConnection?.on("answer", (answer: string) => {
      setDialogues((prev) => [...prev, { content: answer, clientId: null }]);
      setIsAsking(true);
    });

    socketConnection?.on("winner", (winner: string) => {
      setWinner(winner);
    });

    socketConnection?.on("bad-guess", (message: string) => {
      setDialogues((prev) => [
        ...prev,
        {
          content: `Your opponent incorrectly guessed that you were ${message}`,
          clientId: null,
        },
      ]);
      setIsMyTurn(true);
    });

    socketConnection?.on("ready", () => setOpponentReady(true));

    socketConnection?.on("new-game", (gameId: string) => {
      router.push(`/game/${gameId}`);
    });

    socketConnection?.on("error", (error: string) => {
      console.error("Error:", error);
      setErrorMessage(error);
    });
  }, [socketConnection, clientId, router]);

  return {
    socketConnection,
    yourCharacter,
    board,
    isMyTurn,
    dialogues,
    winner,
    isAsking,
    opponentRemainingCharacters,
    yourRemainingCharacters,
    playerCount,
    opponentReady,
    errorMessage,
    setIsAsking,
    setDialogues,
    setWinner,
    setIsMyTurn,
    router,
  };
};
