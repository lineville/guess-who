"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Flex, Button, useBreakpointValue, Box } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import Instructions from "@/components/Instructions";
import GradientBackground from "@/components/GradientBackground";
import Header from "@/components/Header";
import { GameType } from "@/lib/gameType";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [gameType, setGameType] = useState<GameType>("default");

  // Generate a new clientId and gameId
  const createGame = () => {
    const clientId = uuidv4();
    localStorage.setItem("clientId", clientId);

    const gameId = uuidv4();
    router.push(`/game/${gameType}/${gameId}`);

    // TODO add a dropdown of different gameTypes and pass that value to the game component
  };

  return (
    <GradientBackground>
      <Flex
        direction="column"
        align="center"
        h="100vh"
        overflow="auto"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box mb={isMobile ? 4 : 20}>
          <Header title="Guess Who" />
        </Box>
        <Box mb={isMobile ? 4 : 30}>
          <Button
            onClick={createGame}
            size="lg"
            colorScheme="teal"
            rightIcon={<ArrowRightIcon />}
          >
            New Game
          </Button>
        </Box>
        <Box
          ml={isMobile ? 2 : 0}
          mr={isMobile ? 2 : 0}
          flex={1}
          overflowY={"auto"}
          mb={4}
        >
          <Instructions />
        </Box>
      </Flex>
    </GradientBackground>
  );
}
