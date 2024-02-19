"use client";
import { useEffect } from "react";
import Board from "@/components/Board";
import {
  Box,
  Flex,
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
  useToast,
} from "@chakra-ui/react";
import QuestionModal from "@/components/QuestionModal";
import AnswerModal from "@/components/AnswerModal";
import { ArrowLeftIcon, HamburgerIcon, StarIcon } from "@chakra-ui/icons";
import Dialogue from "@/components/Dialogue";
import GuessCharacterModal from "@/components/GuessCharacterModal";
import WinnerModal from "@/components/WinnerModal";
import { COLUMNS } from "@/lib/constants";
import { useSocket } from "@/hooks/useSocket";

// TODO swap out a few more of the characters
// - Make all of them the more cartoonish style

// TODO Feature idea from the main lobby when creating a new game user can have a bit more options to get started
// - They can leave the default character models
// - They can choose from a set of defined types of characters (super heroes, celebs, cartoon, realistic etc.) This will load a game using a different folder of characters and images

// TODO Feature idea: allow public or private games. Private games means you send the link to a friend as it works now. Public games means you can join a random game with a random person

interface GameProps {
  clientId: string;
}

export default function Game({ clientId }: GameProps): JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const toast = useToast();

  useEffect(() => {
    if (isMyTurn && playerCount > 1) {
      toast({
        title: "Your Turn",
        description: "It's your turn to play!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const link = document.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement;
      if (!link) return;

      link.href = "/notification-favicon.ico";
    }

    return () => {
      const link = document.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement;
      if (!link) return;
      link.href = "/favicon.ico";
    };
  }, [isMyTurn, toast, playerCount]);

  // ----------------- User Action Handlers -----------------

  // Flip the character card
  const handleClickCharacter = (index: number) => {
    socketConnection?.emit(board[index].alive ? "eliminate" : "revive", index);
  };

  // Ask a question to your opponent
  const askQuestion = async (question: string) => {
    await socketConnection?.emit("ask", question);
    setIsMyTurn(false);
    setIsAsking(false);
    setDialogues((prev) => [
      ...prev,
      { content: question, clientId: clientId },
    ]);
  };

  // Answer your opponent's question
  const answerQuestion = async (answer: string) => {
    await socketConnection?.emit("answer", answer);
    setIsAsking(true);
    setDialogues((prev) => [...prev, { content: answer, clientId: clientId }]);
  };

  // Guess your opponent's character
  const guessCharacter = async (character: string) => {
    await socketConnection?.emit("guess", character);
    closeGuessCharacterModal();
    setIsMyTurn(false);
    setIsAsking(true);
    setDialogues((prev) => [
      ...prev,
      {
        content: `Are you ${character}?`,
        clientId: clientId,
      },
    ]);
  };

  // Ready up for a new game
  const handleReady = async () => {
    await socketConnection?.emit("ready");
  };

  // Reset the winner when winner modal is closed
  const resetWinner = () => setWinner("");

  // Generate 5 new AI images (for testing purposes only)
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
          data-testid="game-container"
        >
          {process.env.NODE_ENV === "development" && (
            <IconButton
              onClick={generateImages}
              icon={<StarIcon />}
              aria-label={"generate-ai-images"}
              isRound={true}
              variant="solid"
              position="fixed"
              top="1em"
              right="4em"
            />
          )}

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
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton onClick={closeDrawer} zIndex={2} />
                  <DrawerBody overflowY="auto" style={{ touchAction: "auto" }}>
                    <Dialogue
                      playerCount={playerCount}
                      yourCharacter={yourCharacter}
                      isMyTurn={isMyTurn}
                      isAsking={isAsking}
                      yourRemainingCharacters={yourRemainingCharacters}
                      opponentRemainingCharacters={opponentRemainingCharacters}
                      handleOpenQuestionModal={openQuestionModal}
                      handleOpenAnswerModal={openAnswerModal}
                      handleGuessCharacter={openGuessCharacterModal}
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
                handleGuessCharacter={openGuessCharacterModal}
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
              onClose={resetWinner}
              handleReady={handleReady}
              opponentReady={opponentReady}
              playerCount={playerCount}
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
