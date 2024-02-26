"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  Flex,
  Button,
  useBreakpointValue,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
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
          <Button onClick={createGame} size="lg" colorScheme="teal">
            New Game
          </Button>
        </Box>
        <Box mb={isMobile ? 4 : 30}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Game Type: {gameType}
            </MenuButton>
            <MenuList
              maxH="60vh"
              overflowY="auto"
              style={{ touchAction: "auto" }}
              zIndex={2}
            >
              {(["default", "super-heroes"] as GameType[]).map(
                (type: GameType, index) => (
                  <MenuItem key={index} onClick={() => setGameType(type)}>
                    <Box display="flex" alignItems="center">
                      <Text>{type.toString()}</Text>
                    </Box>
                  </MenuItem>
                )
              )}
            </MenuList>
          </Menu>
        </Box>

        <Instructions />
      </Flex>
    </GradientBackground>
  );
}
