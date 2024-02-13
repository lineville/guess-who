import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  List,
  Box,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "../styles.module.css";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (answer: string) => void;
  question: string;
}

const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  onAnswer,
  question,
}) => {
  const [answer, setAnswer] = useState("");

  const handleAnswer = async () => {
    await onAnswer(answer);
    setAnswer("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="75vh">
        <ModalHeader>{question}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" style={{ touchAction: "auto" }}>
          <List spacing={3}>
            <Box
              className={styles.questionHover}
              onClick={() => setAnswer("Yes")}
              cursor="pointer"
              color="blue.500"
              borderWidth="1px"
              borderRadius="md"
              p={3}
              mb={2}
            >
              <Text>Yes</Text>
            </Box>
            <Box
              className={styles.questionHover}
              onClick={() => setAnswer("No")}
              cursor="pointer"
              color="blue.500"
              borderWidth="1px"
              borderRadius="md"
              p={3}
              mb={2}
            >
              <Text>No</Text>
            </Box>
          </List>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Maybe..."
            marginTop="1em"
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAnswer}>
            Answer
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AnswerModal;
