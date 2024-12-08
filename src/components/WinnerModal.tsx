import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WinnerModalProps {
  winner: string;
  isOpen: boolean;
  onClose: () => void;
  handleReady: () => void;
  opponentReady: boolean;
  playerCount: number;
}

export default function WinnerModal({
  winner,
  isOpen,
  onClose,
  handleReady,
  opponentReady,
  playerCount,
}: WinnerModalProps): JSX.Element {
  const clientId = localStorage.getItem("clientId") as string;
  const router = useRouter();
  const [showPlayAgain, setShowPlayAgain] = useState(true);
  const [ready, setReady] = useState(false);

  const handleClickPlayAgain = async () => {
    setShowPlayAgain(false);
    await handleReady();
    setReady(true);
  };

  useEffect(() => {
    if (playerCount < 2) {
      setShowPlayAgain(false);
    }
  }, [playerCount]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent textAlign="center" maxH="75vh">
        <ModalHeader>
          {winner === clientId
            ? "🎉 You nailed it! Nice guess, you won this round!"
            : "😭 Your opponent guessed you! You'll get the next one!"}
        </ModalHeader>
        <ModalBody
          justifyContent="center"
          overflowY="auto"
          style={{ touchAction: "auto" }}
        >
          {playerCount < 2 && <Text>Your opponent has left the game</Text>}
          {ready && !opponentReady && (
            <Text>Waiting on opponent to ready up</Text>
          )}
          {opponentReady && !ready && (
            <Text>Opponent is waiting on you to ready up</Text>
          )}
          {(ready || opponentReady) && playerCount >= 2 && (
            <Progress size="lg" isIndeterminate />
          )}
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            colorScheme="green"
            mr={3}
            onClick={() => router.push("/")}
            leftIcon={<ArrowLeftIcon />}
          >
            Back to Lobby
          </Button>
          {showPlayAgain && (
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleClickPlayAgain}
              rightIcon={<ArrowRightIcon />}
            >
              Play Again
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
