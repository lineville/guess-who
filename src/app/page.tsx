"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Flex, Button, useBreakpointValue } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import Instructions from "@/components/Instructions";

export default function Home() {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Generate a new clientId and gameId
  const createGame = () => {
    const clientId = uuidv4();
    localStorage.setItem("clientId", clientId);

    const gameId = uuidv4();
    router.push(`/game/${gameId}`);
  };

  return (
    <Flex justifyContent={"center"} alignItems={"center"}>
      <Button
        onClick={createGame}
        size="lg"
        colorScheme="teal"
        rightIcon={<ArrowRightIcon />}
        pos={"absolute"}
        top={isMobile ? "10vh" : "15vh"}
      >
        New Game
      </Button>
      <Instructions />
    </Flex>
  );
}
