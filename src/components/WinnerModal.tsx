import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Button, ModalFooter, ModalCloseButton, Text, Progress } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { useState } from "react";

interface WinnerModalProps {
  winner: string;
  isOpen: boolean;
  onClose: () => void;
  playAgain: () => void;
  ready: boolean;
  opponentReady: boolean;
}


const WinnerModal: React.FC<WinnerModalProps> = ({ winner, isOpen, onClose, playAgain, ready, opponentReady }) => {
  const clientId = localStorage.getItem('clientId') as string;
  const router = useRouter();
  const [showPlayAgain, setShowPlayAgain] = useState(true);

  const handleClickPlayAgain = () => {
    setShowPlayAgain(false);
    playAgain();
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent textAlign="center">
        <ModalHeader>{winner === clientId ? '🎉 You nailed it! Nice guess, you won this round!' : "😭 Your opponent guessed you... You'll get the next one!"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody justifyContent="center">
          {(ready && !opponentReady) && (<Text>Waiting on opponent to ready up...</Text>)}
          {(opponentReady && !ready) && (<Text>Opponent is waiting on you to ready up...</Text>)}
          {(ready || opponentReady) && (<Progress size='lg' isIndeterminate />)}
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="green" mr={3} onClick={() => router.push("/")} leftIcon={<ArrowLeftIcon />}>
            Back to Lobby
          </Button>
          {showPlayAgain && (<Button colorScheme="blue" mr={3} onClick={handleClickPlayAgain} rightIcon={<ArrowRightIcon />}>
            Play Again
          </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WinnerModal;