import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Textarea, Button, List, Box } from "@chakra-ui/react";
import { useState } from "react";
import styles from '../styles.module.css'

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAsk: (question: string) => void;
}


const sampleQuestions = [
  "Are you a fun person to be around?",
  "Have you thought about the Roman Empire today?",
  "Do you think we should go back to the 'Good Old Days'?",
];

const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, onAsk }) => {
  const [question, setQuestion] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);

  const handleAskQuestion = async () => {
    await onAsk(question);
    setQuestion("");
    onClose();
  };


  const handleAskAI = async () => {
    setIsFetchingQuestions(true);
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setAiQuestions(data.questions);
    } catch (error) {
      console.error('Failed to fetch AI questions:', error);
    }
    setIsFetchingQuestions(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Your turn to ask a question!</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxH="70vh">
          <FormControl>
            <FormLabel>Choose one of the example questions below or write your own</FormLabel>
            <List spacing={3}>
              {sampleQuestions.concat(aiQuestions).map((question, index) => (
                <Box
                  className={styles.questionHover}
                  key={index}
                  onClick={() => setQuestion(question)}
                  onMouseEnter={() => setPlaceholder(question)}
                  onMouseLeave={() => setPlaceholder("")}
                  cursor="pointer"
                  color="blue.500"
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  mb={2}
                >
                  {question}
                </Box>
              ))}
            </List>
            <Button isLoading={isFetchingQuestions} onClick={handleAskAI} mt={4}>Ask AI ✨</Button>
            <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={placeholder} marginTop="1em" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAskQuestion}>
            Ask
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionModal;