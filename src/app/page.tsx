"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  Flex,
  Button,
  useBreakpointValue,
  Box,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
} from "@chakra-ui/react";
import { ArrowRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Instructions from "@/components/Instructions";
import GradientBackground from "@/components/GradientBackground";
import Header from "@/components/Header";
import { GameType } from "@/lib/gameType";
import { useState } from "react";
import { GameMode } from "@/lib/gameMode";
import { formatMenuItem, menuItemImage } from "@/lib/menuHelpers";

export default function Home() {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [gameType, setGameType] = useState<GameType>(GameType.Pixar);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MultiPlayer);

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

        <HStack spacing={4} mb={isMobile ? 4 : 30}>
          <Box>
            <Text fontSize="sm" mb={2}>
              Game Mode:
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
                size="lg"
              >
                {formatMenuItem(gameMode)}
              </MenuButton>
              <MenuList
                maxH="60vh"
                overflowY="auto"
                style={{ touchAction: "auto" }}
                zIndex={2}
              >
                {(Object.values(GameMode) as GameMode[]).map(
                  (mode: GameMode, index) => (
                    <MenuItem key={index} onClick={() => setGameMode(mode)} isDisabled={mode === GameMode.SinglePlayer}>
                      <Box display="flex" alignItems="center">
                        <Text mr={2}>{mode === GameMode.SinglePlayer ? '🤖' : '👬'}</Text>
                        <Text>{formatMenuItem(mode)}</Text>
                      </Box>
                    </MenuItem>
                  )
                )}
              </MenuList>
            </Menu>
          </Box>
          <Box>
            <Text fontSize="sm" mb={2}>
              Game Type:
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
                size="lg"
              >
                {formatMenuItem(gameType)}
              </MenuButton>
              <MenuList
                maxH="60vh"
                overflowY="auto"
                style={{ touchAction: "auto" }}
                zIndex={2}
              >
                {(Object.values(GameType) as GameType[]).map(
                  (type: GameType, index) => (
                    <MenuItem key={index} onClick={() => setGameType(type)}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          name="Tonto"
                          src={menuItemImage(type)}
                          size="xs"
                          mr="2"
                        />
                        <Text>{formatMenuItem(type)}</Text>
                      </Box>
                    </MenuItem>
                  )
                )}
              </MenuList>
            </Menu>
          </Box>
          <Button
            onClick={createGame}
            size="lg"
            colorScheme="blue"
            ml={2}
            rightIcon={<ArrowRightIcon />}
            mt={8}
          >
            Play
          </Button>
        </HStack>

        <Box mb={isMobile ? 4 : 30}></Box>

        <Instructions />
      </Flex>
    </GradientBackground>
  );
}
