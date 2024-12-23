import Player from "@/components/Player";
import { GameType } from "@/lib/gameType";
import Message from "@/lib/message";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Progress,
  SlideFade,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";


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
  gameType: GameType;
  handleOpenQuestionModal: () => void;
  handleOpenAnswerModal: () => void;
  handleGuessCharacter: () => void;
  isMobile?: boolean;
}

export default function Dialogue({
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
  gameType,
  winner,
  isMobile,
}: DialogueProps): JSX.Element {
  const { colorMode } = useColorMode();

  const [isInviteCopied, setIsInviteCopied] = useState(false);
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsInviteCopied(true);
    setTimeout(() => setIsInviteCopied(false), 3000); // Set back to false after 3 seconds
  };

  return (
    <SlideFade in={true} offsetX={"200vw"}>
      <VStack spacing={4} align="center">
        <Flex width="95%" justifyContent="space-between" mb="1em" mt="1em">
          {Array.from({ length: playerCount }).map((_, index) => (
            <SlideFade in={true} offsetX="50px" key={index}>
              <Flex justifyContent={index !== 0 ? "flex-start" : "flex-end"}>
                <Player
                  character={yourCharacter}
                  isMyTurn={isMyTurn}
                  remainingCharacters={
                    index !== 0
                      ? yourRemainingCharacters
                      : opponentRemainingCharacters
                  }
                  secret={index === 0}
                  gameType={gameType}
                />
              </Flex>
            </SlideFade>
          ))}
        </Flex>

        <Card size={isMobile ? "md" : "lg"}>
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
                {isInviteCopied ? (
                  <CheckIcon ml={2} data-testid="check" />
                ) : (
                  <CopyIcon ml={2} data-testid="copy" />
                )}
              </Button>
            </CardHeader>
          )}

          <CardBody>
            {dialogues.map(({ content, clientId }, index) => (
              <SlideFade in={true} offsetY="20px" offsetX="20px" key={index}>
                <Flex
                  justifyContent={
                    userId === clientId ? "flex-end" : "flex-start"
                  }
                  alignItems="flex-end"
                  mb={2}
                >
                  <Avatar
                    name={userId === clientId ? yourCharacter : "question-mark"}
                    src={
                      userId === clientId
                        ? `/${gameType}/${yourCharacter}.png`
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
              </SlideFade>
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
                  <Button onClick={handleOpenAnswerModal}>
                    Answer Question
                  </Button>
                )}
              </Flex>
            </CardFooter>
          ) : (
            <>
              {!winner && (
                <Box sx={{ mx: 2 }}>
                  <Text textAlign="center" mr={4} ml={4}>
                    Waiting on opponent{" "}
                    {playerCount === 1
                      ? ""
                      : isAsking || dialogues.length === 0
                        ? "to ask a question"
                        : "to answer you"}
                    ...
                  </Text>
                  <Progress
                    size="md"
                    isIndeterminate
                    hasStripe
                    sx={{ borderRadius: "4px", margin: "4px" }}
                  />
                </Box>
              )}
            </>
          )}
        </Card>
      </VStack>
    </SlideFade>
  );
}
