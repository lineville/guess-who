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
  Highlight,
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
    router.push(`/game/${gameMode}/${gameType}/${gameId}`);
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

        <HStack spacing={[2, 4]}>
          <Box>
            <Text fontSize="sm" mb={2} whiteSpace="nowrap">
              Game Mode:
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
                size={["sm", "lg"]}
              >
                {(gameMode === GameMode.SinglePlayer ? "🧍‍♂️ " : "👬 ") +
                  formatMenuItem(gameMode)}
              </MenuButton>
              <MenuList
                maxH="60vh"
                overflowY="auto"
                style={{ touchAction: "auto" }}
                zIndex={2}
              >
                {(Object.values(GameMode) as GameMode[]).map(
                  (mode: GameMode, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => setGameMode(mode)}
                      isDisabled={mode === GameMode.SinglePlayer}
                    >
                      <Box display="flex" alignItems="center">
                        <Text mr={2}>
                          {mode === GameMode.SinglePlayer ? "🧍‍♂️" : "👬"}
                        </Text>
                        <Text>
                          {formatMenuItem(mode)}
                          {mode === GameMode.SinglePlayer ? (
                            <Highlight
                              query="Coming soon"
                              styles={{
                                px: "1",
                                py: "0.5",
                                rounded: "full",
                                bg: "blue.500",
                              }}
                            >
                              {"  Coming soon"}
                            </Highlight>
                          ) : (
                            ""
                          )}
                        </Text>
                      </Box>
                    </MenuItem>
                  )
                )}
              </MenuList>
            </Menu>
          </Box>
          <Box>
            <Text fontSize="sm" mb={2} whiteSpace="nowrap">
              Style:
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
                size={["sm", "lg"]}
              >
                <Flex alignItems="center">
                  <Avatar
                    name="Tonto"
                    src={menuItemImage(gameType)}
                    size="xs"
                    mr="2"
                  />
                  {formatMenuItem(gameType)}
                </Flex>
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
        </HStack>

        <HStack spacing={[2, 4]}  mb={6}>
          <Button
            onClick={createGame}
            size="lg"
            colorScheme="blue"
            mx={isMobile ? 0 : 2}
            rightIcon={<ArrowRightIcon />}
            mt={4}
            minW={['300px', '418px']}
          >
            Play
          </Button>
        </HStack>
        <Instructions />
      </Flex>
    </GradientBackground>
  );
}
