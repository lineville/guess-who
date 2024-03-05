import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  List,
  Box,
  SlideFade,
  CloseButton,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "../styles/styles.module.css";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAsk: (question: string) => void;
}

const INITIAL_SAMPLE_QUESTIONS = [
  "Are you a fun person to be around?",
  "Have you thought about the Roman Empire today?",
  "Do you think we should go back to the 'Good Old Days'?",
];

export default function QuestionModal({
  isOpen,
  onClose,
  onAsk,
}: QuestionModalProps): JSX.Element {
  const [question, setQuestion] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>(
    INITIAL_SAMPLE_QUESTIONS
  );

  const handleAskQuestion = async () => {
    await onAsk(question);
    setQuestion("");
    onClose();
  };

  const handleAskAI = async () => {
    setIsFetchingQuestions(true);
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions((prev) => [...data.questions, ...prev]);
    } catch (error) {
      console.error("Failed to fetch AI questions:", error);
    }
    setIsFetchingQuestions(false);
  };

  const handleRemoveQuestion = (e: React.MouseEvent, question: string) => {
    e.stopPropagation();
    setQuestions((prev) => prev.filter((q) => q !== question));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="75vh">
        <ModalHeader textAlign="center">
          Your turn to ask a question!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" style={{ touchAction: "auto" }}>
          <FormControl>
            <FormLabel>
              Choose a sample question, ask AI for help or write your own
            </FormLabel>
            <Button
              isLoading={isFetchingQuestions}
              onClick={handleAskAI}
              mt={2}
              mb={4}
              loadingText="Thinking 🤔 ..."
            >
              Ask AI ✨
            </Button>
            <List spacing={3}>
              {questions.map((question, index) => (
                <SlideFade in={true} offsetX={"200vw"} key={index}>
                  <Box
                    className={styles.questionHover}
                    onClick={() => setQuestion(question)}
                    onMouseEnter={() => setPlaceholder(question)}
                    onMouseLeave={() => setPlaceholder("")}
                    cursor="pointer"
                    color="blue.500"
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    mb={2}
                    data-testid={`question-${index}`}
                  >
                    <Text sx={{pr: 2}}>{question}</Text>
                    <CloseButton
                      size="sm"
                      onClick={(e) => handleRemoveQuestion(e, question)}
                      sx={{ pos: "absolute", top: 2, right: 2, ml: 2 }}
                    />
                  </Box>
                </SlideFade>
              ))}
            </List>

            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              marginTop="1em"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleAskQuestion}
            isDisabled={!question.trim()}
          >
            Ask
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
