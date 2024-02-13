"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Button, Center } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";

export default function Home() {
  const router = useRouter();

  const createGame = () => {
    const clientId = uuidv4();
    localStorage.setItem("clientId", clientId);
    const gameId = uuidv4();
    router.push(`/game/${gameId}`);
  };

  return (
    <Center h="20vh">
      <Button
        onClick={createGame}
        size="lg"
        colorScheme="teal"
        rightIcon={<ArrowRightIcon />}
      >
        New Game
      </Button>
    </Center>
  );
}
