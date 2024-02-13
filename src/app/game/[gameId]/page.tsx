"use client";
import { useEffect, useState } from "react";
import Board from "@/components/Board";
import {
  Box,
  Flex,
  useColorMode,
  IconButton,
  Button,
  VStack,
  Text,
  useDisclosure,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import QuestionModal from "@/components/QuestionModal";
import AnswerModal from "@/components/AnswerModal";
import {
  ArrowLeftIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import Dialogue from "@/components/Dialogue";
import GuessCharacterModal from "@/components/GuessCharacterModal";
import WinnerModal from "@/components/WinnerModal";
import { COLUMNS } from "@/constants";
import { useSocket } from "@/hooks/useSocket";

// TODO add some transitions to messages
// TODO add a notification when it's your turn

export default function Game() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [clientId, setClientId] = useState<string>("");
  useEffect(() => setClientId(localStorage.getItem("clientId") || ""), []);

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const {
    isOpen: isQuestionModalOpen,
    onOpen: openQuestionModal,
    onClose: closeQuestionModal,
  } = useDisclosure();

  const {
    isOpen: isAnswerModalOpen,
    onOpen: openAnswerModal,
    onClose: closeAnswerModal,
  } = useDisclosure();

  const {
    isOpen: isGuessCharacterModalOpen,
    onOpen: openGuessCharacterModal,
    onClose: closeGuessCharacterModal,
  } = useDisclosure();

  const {
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
    setDialogues,
    setIsAsking,
    setWinner,
    setIsMyTurn,
    router,
  } = useSocket(clientId);

  // ----------------- User Action Handlers -----------------
  const handleClickCharacter = (index: number) => {
    socketConnection?.emit(board[index].alive ? "eliminate" : "revive", index);
  };

  const askQuestion = async (question: string) => {
    await socketConnection?.emit("ask", question);
    setIsMyTurn(false);
    setIsAsking(false);
    setDialogues((prev) => [
      ...prev,
      { content: question, clientId: localStorage.getItem("clientId") },
    ]);
  };

  const answerQuestion = async (answer: string) => {
    await socketConnection?.emit("answer", answer);
    setIsAsking(true);
    setDialogues((prev) => [
      ...prev,
      { content: answer, clientId: localStorage.getItem("clientId") },
    ]);
  };

  const guessCharacter = async (character: string) => {
    await socketConnection?.emit("guess", character);
    closeGuessCharacterModal();
    setIsMyTurn(false);
    setIsAsking(true);
    setDialogues((prev) => [
      ...prev,
      {
        content: `Are you ${character}?`,
        clientId: localStorage.getItem("clientId"),
      },
    ]);
  };

  const handleGuessCharacter = () => {
    openGuessCharacterModal();
  };

  const handleCloseWinnerModal = () => setWinner("");

  const handleReady = async () => {
    await socketConnection?.emit("ready");
  };

  const generateImages = async () => {
    fetch("/api/images")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate images");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Generated images:", data);
      })
      .catch((error) => {
        console.error("Failed to generate images:", error);
      });
  };

  // ----------------- Render -----------------

  return (
    <>
      {errorMessage.length ? (
        <VStack justifyContent="center">
          <Text mb={4}>
            🚧 Uh oh! Looks like the game you tried to join is already full...
          </Text>
          <Box>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => router.push("/")}
              leftIcon={<ArrowLeftIcon />}
            >
              Back to Lobby
            </Button>
          </Box>
        </VStack>
      ) : (
        <Flex
          direction="row"
          justify="flex-start"
          align="stretch"
          h="90vh"
          w="96vw"
          pr={0}
        >
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label={"dark-mode-toggle"}
            isRound={true}
            variant="solid"
            position="fixed"
            top="1em"
            left="1em"
          />
          {/* <IconButton onClick={generateImages} icon={<StarIcon />} aria-label={'generate-ai-images'} isRound={true} variant='solid' position="fixed" top='1em' right='4em' /> */}

          {isMobile && (
            <IconButton
              icon={<HamburgerIcon />}
              onClick={openDrawer}
              aria-label={"Open drawer"}
              isRound={true}
              variant="solid"
              position="fixed"
              top="1em"
              right="1em"
            />
          )}

          <Box mr={2} ml={2} mt={2} w={["90vw", "75vw"]}>
            <Board
              board={board}
              handleClickCharacter={handleClickCharacter}
              columns={COLUMNS}
            />
          </Box>

          {isMobile ? (
            <Drawer
              isOpen={isDrawerOpen}
              placement="right"
              onClose={closeDrawer}
              blockScrollOnMount={false}
            >
              <DrawerOverlay w="full" h="full">
                <DrawerContent>
                  <DrawerCloseButton onClick={closeDrawer} />
                  <DrawerBody>
                    <Dialogue
                      playerCount={playerCount}
                      yourCharacter={yourCharacter}
                      isMyTurn={isMyTurn}
                      isAsking={isAsking}
                      yourRemainingCharacters={yourRemainingCharacters}
                      opponentRemainingCharacters={opponentRemainingCharacters}
                      handleOpenQuestionModal={openQuestionModal}
                      handleOpenAnswerModal={openAnswerModal}
                      handleGuessCharacter={handleGuessCharacter}
                      dialogues={dialogues}
                      userId={clientId}
                      winner={winner}
                    />
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          ) : (
            <Box ml="auto" flexGrow={1} right="1em" maxW="20vw">
              <Dialogue
                playerCount={playerCount}
                yourCharacter={yourCharacter}
                isMyTurn={isMyTurn}
                isAsking={isAsking}
                yourRemainingCharacters={yourRemainingCharacters}
                opponentRemainingCharacters={opponentRemainingCharacters}
                handleOpenQuestionModal={openQuestionModal}
                handleOpenAnswerModal={openAnswerModal}
                handleGuessCharacter={handleGuessCharacter}
                dialogues={dialogues}
                userId={clientId}
                winner={winner}
              />
            </Box>
          )}
          {winner && (
            <WinnerModal
              isOpen={winner !== null}
              winner={winner}
              onClose={handleCloseWinnerModal}
              handleReady={handleReady}
              opponentReady={opponentReady}
            />
          )}
          <QuestionModal
            isOpen={isQuestionModalOpen}
            onClose={closeQuestionModal}
            onAsk={askQuestion}
          />
          <AnswerModal
            isOpen={isAnswerModalOpen}
            onClose={closeAnswerModal}
            onAnswer={answerQuestion}
            question={dialogues[dialogues.length - 1]?.content}
          />
          <GuessCharacterModal
            isOpen={isGuessCharacterModalOpen}
            onClose={closeGuessCharacterModal}
            onGuess={guessCharacter}
            remainingCharacters={board
              .filter((c) => c.alive)
              .sort((a, b) => a.name.localeCompare(b.name))}
          />
        </Flex>
      )}
    </>
  );
}
