import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  VStack,
  Text,
  Progress,
  Box,
  useColorMode,
  Heading,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import Player from "@/components/Player";
import { useState } from "react";
import Message from "@/message";

interface DialogueProps {
  playerCount: number;
  yourCharacter: string;
  isMyTurn: boolean;
  isAsking: boolean;
  winner: string;
  userId: string;
  yourRemainingCharacters: number;
  opponentRemainingCharacters: number;
  dialogues: Message[];
  handleOpenQuestionModal: () => void;
  handleOpenAnswerModal: () => void;
  handleGuessCharacter: () => void;
}

const Dialogue: React.FC<DialogueProps> = ({
  playerCount,
  yourCharacter,
  isMyTurn,
  yourRemainingCharacters,
  opponentRemainingCharacters,
  isAsking,
  handleOpenQuestionModal,
  handleOpenAnswerModal,
  handleGuessCharacter,
  dialogues,
  userId,
  winner,
}) => {
  const { colorMode } = useColorMode();

  const [isInviteCopied, setIsInviteCopied] = useState(false);
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsInviteCopied(true);
    setTimeout(() => setIsInviteCopied(false), 3000); // Set back to false after 3 seconds
  };

  return (
    <VStack spacing={4} align="center">
      <Flex width="70%" justifyContent="space-between" mb="1em" mt="1em">
        {Array.from({ length: playerCount }).map((_, index) => (
          <Flex
            justifyContent={index !== 0 ? "flex-start" : "flex-end"}
            key={index}
          >
            <Player
              character={yourCharacter}
              isMyTurn={isMyTurn}
              remainingCharacters={
                index !== 0
                  ? yourRemainingCharacters
                  : opponentRemainingCharacters
              }
              secret={index === 0}
            />
          </Flex>
        ))}
      </Flex>

      <Card size="md">
        {playerCount === 1 && (
          <CardHeader textAlign="center">
            <Heading size="md" mb={4}>
              Invite a Friend!
            </Heading>
            <Button
              onClick={handleCopyInviteLink}
              aria-label={"copy invite link"}
            >
              Copy Invite
              {isInviteCopied ? <CheckIcon ml={2} /> : <CopyIcon ml={2} />}
            </Button>
          </CardHeader>
        )}

        <CardBody>
          {dialogues.map(({ content, clientId }, index) => (
            <Flex
              justifyContent={userId === clientId ? "flex-end" : "flex-start"}
              alignItems="flex-end"
              key={index}
              mb={2}
            >
              <Avatar
                name={userId === clientId ? yourCharacter : "question-mark"}
                src={
                  userId === clientId
                    ? `/${yourCharacter}.png`
                    : "/question-mark.png"
                }
                order={userId === clientId ? 2 : 1}
                size="sm"
                ml="1em"
                mr="1em"
              />
              <Box
                p={3}
                borderRadius="lg"
                bg={colorMode === "light" ? "#f0f0f0" : "#070e22"}
                maxWidth="80%"
                order={userId === clientId ? 1 : 2}
              >
                <Text>{content}</Text>
              </Box>
            </Flex>
          ))}
        </CardBody>

        {isMyTurn && playerCount > 1 ? (
          <CardFooter>
            <Flex width="100%" justifyContent="flex-end">
              {isAsking ? (
                <HStack spacing={2}>
                  <Button
                    onClick={handleGuessCharacter}
                    colorScheme="blue"
                    ml="1em"
                  >
                    Guess Who!
                  </Button>
                  <Button onClick={handleOpenQuestionModal} ml="1em">
                    Ask Question
                  </Button>
                </HStack>
              ) : (
                <Button onClick={handleOpenAnswerModal}>Answer Question</Button>
              )}
            </Flex>
          </CardFooter>
        ) : (
          <>
            {!winner && (
              <Box>
                <Text textAlign="center" mr={2} ml={2}>
                  Waiting on opponent to{" "}
                  {playerCount === 1
                    ? "join"
                    : isAsking || dialogues.length === 0
                    ? "ask a question"
                    : "answer you"}
                  ...
                </Text>
                <Progress size="md" isIndeterminate />
              </Box>
            )}
          </>
        )}
      </Card>
    </VStack>
  );
};

export default Dialogue;
