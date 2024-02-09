'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Board from '@/components/Board';
import Character from '@/character';
import { Box, Flex, useColorMode, IconButton, Button, VStack, Text, useDisclosure, useBreakpointValue, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { socket } from '@/socket';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import QuestionModal from "@/components/QuestionModal";
import AnswerModal from "@/components/AnswerModal";
import { ArrowLeftIcon, MoonIcon, StarIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import Dialogue from '@/components/Dialogue';
import GuessCharacterModal from '@/components/GuessCharacterModal';
import WinnerModal from '@/components/WinnerModal';
import Message from '@/message';
import GameState from '@/gameState';

const COLUMNS = 6;
const ROWS = 4;

export default function Game() {
  const { colorMode, toggleColorMode } = useColorMode()
  const pathname = usePathname();
  const router = useRouter();

  const [clientId, setClientId] = useState<string>('');
  const [winner, setWinner] = useState('');
  const [board, setBoard] = useState<Character[]>([]);
  const [dialogues, setDialogues] = useState<Message[]>([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [yourCharacter, setYourCharacter] = useState('');
  const [opponentRemainingCharacters, setOpponentRemainingCharacters] = useState<number>(COLUMNS * ROWS);
  const [yourRemainingCharacters, setYourRemainingCharacters] = useState<number>(COLUMNS * ROWS);
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [socketConnection, setSocketConnection] = useState<Socket>();
  const [isAsking, setIsAsking] = useState(true);
  const [ready, setReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const handleOpenQuestionModal = () => setIsQuestionModalOpen(true);
  const handleCloseQuestionModal = () => setIsQuestionModalOpen(false);

  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const handleOpenAnswerModal = () => setIsAnswerModalOpen(true);
  const handleCloseAnswerModal = () => setIsAnswerModalOpen(false);

  const [isGuessCharacterModalOpen, setIsGuessCharacterModalOpen] = useState(false);
  const handleGuessCharacter = () => {
    setIsGuessCharacterModalOpen(true);
  }

  const handleCloseWinnerModal = () => setWinner('');

  const handlePlayAgain = async () => {
    await socketConnection?.emit('ready');
    setReady(true);
  }

  // Hook that handles the socket connection
  useEffect(() => {
    const gameId = (pathname as string).substring("/game/".length);
    const newSocket = socket(gameId, clientId);
    setSocketConnection(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [pathname, clientId]);

  // Hook that handles all the websocket events
  useEffect(() => {
    socketConnection?.on('init', (data: GameState) => {
      const eliminatedChars = new Set(data.eliminatedCharacters);
      setYourCharacter(data.yourCharacter);
      setBoard(data.characters.map((name: string, idx: number) => ({ name, image: `/${name}.png`, alive: !eliminatedChars.has(idx) })));
      setIsMyTurn(data.turn === clientId);
      setDialogues(data.dialogues);
      setWinner(data.winner || '');
      setIsAsking(data.isAsking);
    })

    socketConnection?.on('turn', (userId: string) => {
      setIsMyTurn(userId === clientId);
    })

    socketConnection?.on('eliminate', (eliminatedIndexes: Set<number>) => {
      setBoard(prev => prev.map((c, index) => ({ ...c, alive: !(new Set(eliminatedIndexes).has(index)) })));
    });

    socketConnection?.on('revive', (eliminatedIndexes: Set<number>) => {
      setBoard(prev => prev.map((c, index) => ({ ...c, alive: !(new Set(eliminatedIndexes).has(index)) })));
    });

    socketConnection?.on('eliminated-count', (eliminatedCount: number) => {
      setOpponentRemainingCharacters(COLUMNS * ROWS - eliminatedCount);
    });

    socketConnection?.on('playerCount', (count: number) => {
      setPlayerCount(count);
    });

    socketConnection?.on('ask', (question: string) => {
      setDialogues(prev => [...prev, { content: question, clientId: null }])
      setIsMyTurn(true);
      setIsAsking(false);
    });

    socketConnection?.on('answer', (answer: string) => {
      setDialogues(prev => [...prev, { content: answer, clientId: null }]);
      setIsAsking(true);
    });

    socketConnection?.on('winner', (winner: string) => {
      setWinner(winner);
    });

    socketConnection?.on('bad-guess', (message: string) => {
      setDialogues(prev => [...prev, { content: `Your opponent incorrectly guessed that you were ${message}`, clientId: null }]);
      setIsMyTurn(true);
    })

    socketConnection?.on('ready', () => setOpponentReady(true));

    socketConnection?.on('new-game', (gameId: string) => {
      router.push(`/game/${gameId}`);
    });

    socketConnection?.on('error', (error: string) => {
      console.error('Error:', error);
      setErrorMessage(error);
    });

  }, [socketConnection, clientId, router]);

  useEffect(() => setYourRemainingCharacters(board.filter(c => c.alive).length), [board]);

  useEffect(() => setClientId(localStorage.getItem('clientId') || ''), []);

  // Update our local board, and send the event to the server to update opponents counter
  const handleClickCharacter = (index: number) => {
    socketConnection?.emit(board[index].alive ? 'eliminate' : 'revive', index);
  }

  const askQuestion = async (question: string) => {
    await socketConnection?.emit('ask', question);
    setIsMyTurn(false);
    setIsAsking(false);
    setDialogues(prev => [...prev, { content: question, clientId: localStorage.getItem('clientId') }])
  }

  const answerQuestion = async (answer: string) => {
    await socketConnection?.emit('answer', answer);
    setIsAsking(true);
    setDialogues(prev => [...prev, { content: answer, clientId: localStorage.getItem('clientId') }])
  }

  const guessCharacter = async (character: string) => {
    await socketConnection?.emit('guess', character);
    setIsGuessCharacterModalOpen(false);
    setIsMyTurn(false);
    setIsAsking(true);
    setDialogues(prev => [...prev, { content: `Are you ${character}?`, clientId: localStorage.getItem('clientId') }]);
  }

  const generateImages = async () => {
    fetch('/api/images')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate images');
        }
        return response.json();
      })
      .then(data => {
        console.log('Generated images:', data);
      })
      .catch(error => {
        console.error('Failed to generate images:', error);
      });
  }

  return (
    <>
      {
        errorMessage.length ? (
          <VStack justifyContent="center">
            <Text mb={4}>🚧 Uh oh! Looks like the game you tried to join is already full...</Text>
            <Box>
              <Button colorScheme="green" mr={3} onClick={() => router.push("/")} leftIcon={<ArrowLeftIcon />}>Back to Lobby</Button>
            </Box>
          </VStack>
        ) : (

          <Flex direction="row" justify="flex-start" align="stretch" h="90vh" w="96vw" pr={0}>

            <IconButton onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} aria-label={'dark-mode-toggle'} isRound={true} variant='solid' position="fixed" top='1em' left='1em' />
            {/* <IconButton onClick={generateImages} icon={<StarIcon />} aria-label={'generate-ai-images'} isRound={true} variant='solid' position="fixed" top='1em' right='4em' /> */}

            {isMobile && (<IconButton
              icon={<HamburgerIcon />}
              onClick={onOpen}
              aria-label={'Open drawer'}
              isRound={true}
              variant='solid'
              position="fixed"
              top='1em'
              right='1em'
            />)}

            <Box mr={2} ml={2} mt={2} w={['90vw', '75vw']}>
              <Board board={board} handleClickCharacter={handleClickCharacter} columns={COLUMNS} />
            </Box >

            {isMobile ? (
              <Drawer isOpen={isOpen} placement="right" onClose={onClose} blockScrollOnMount={false}>
                <DrawerOverlay w="full" h="full">
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                      <Dialogue
                        playerCount={playerCount}
                        yourCharacter={yourCharacter}
                        isMyTurn={isMyTurn}
                        isAsking={isAsking}
                        yourRemainingCharacters={yourRemainingCharacters}
                        opponentRemainingCharacters={opponentRemainingCharacters}
                        handleOpenQuestionModal={handleOpenQuestionModal}
                        handleOpenAnswerModal={handleOpenAnswerModal}
                        handleGuessCharacter={handleGuessCharacter}
                        dialogues={dialogues}
                        userId={clientId}
                        winner={winner} />
                    </DrawerBody>
                  </DrawerContent>
                </DrawerOverlay>
              </Drawer>
            ) : (
              <Box ml="auto" flexGrow={1} right='1em' maxW='20vw'>
                <Dialogue
                  playerCount={playerCount}
                  yourCharacter={yourCharacter}
                  isMyTurn={isMyTurn}
                  isAsking={isAsking}
                  yourRemainingCharacters={yourRemainingCharacters}
                  opponentRemainingCharacters={opponentRemainingCharacters}
                  handleOpenQuestionModal={handleOpenQuestionModal}
                  handleOpenAnswerModal={handleOpenAnswerModal}
                  handleGuessCharacter={handleGuessCharacter}
                  dialogues={dialogues}
                  userId={clientId}
                  winner={winner} />
              </Box>
            )}
            {winner && <WinnerModal isOpen={winner !== null} winner={winner} onClose={handleCloseWinnerModal} playAgain={handlePlayAgain} ready={ready} opponentReady={opponentReady} />}
            <QuestionModal isOpen={isQuestionModalOpen} onClose={handleCloseQuestionModal} onAsk={askQuestion} />
            <AnswerModal isOpen={isAnswerModalOpen} onClose={handleCloseAnswerModal} onAnswer={answerQuestion} question={dialogues[dialogues.length - 1]?.content} />
            <GuessCharacterModal isOpen={isGuessCharacterModalOpen} onClose={() => setIsGuessCharacterModalOpen(false)} onGuess={guessCharacter} remainingCharacters={board.filter(c => c.alive).sort((a, b) => a.name.localeCompare(b.name))} />
          </Flex >
        )
      }
    </>
  );
}