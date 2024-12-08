import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Character from "@/lib/character";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { GameType } from "@/lib/gameType";

interface GuessCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuess: (character: string) => void;
  remainingCharacters: Character[];
  gameType: GameType;
  initialCharacter?: string;
}

export default function GuessCharacterModal({
  isOpen,
  onClose,
  onGuess,
  remainingCharacters,
  gameType,
  initialCharacter,
}: GuessCharacterModalProps): JSX.Element {
  const [character, setCharacter] = useState(initialCharacter || "");

  useEffect(() => {
    if (isOpen) {
      setCharacter(initialCharacter || "");
    }
  }, [isOpen, initialCharacter]);

  const handleGuessCharacter = async () => {
    await onGuess(character);
    setCharacter("");
    onClose();
  };

  const handleClose = () => {
    setCharacter("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Guess the character!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justify="center">
            <Menu size="xl">
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {character ? (
                  <HStack>
                    <Avatar
                      name={character}
                      src={`/${gameType}/${character}.png`}
                      size="sm"
                    />
                    <Text fontSize="xl" ml="4">
                      {character}
                    </Text>
                  </HStack>
                ) : (
                  "Select Character"
                )}
              </MenuButton>
              <MenuList
                maxH="60vh"
                overflowY="auto"
                style={{ touchAction: "auto" }}
                zIndex={2}
              >
                {remainingCharacters?.map((c, index) => (
                  <MenuItem key={index} onClick={() => setCharacter(c.name)}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        name={c.name}
                        src={`/${gameType}/${c.name}.png`}
                        size="xs"
                        mr="2"
                      />
                      <Text>{c.name}</Text>
                    </Box>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </ModalBody>

        <ModalFooter mt={2}>
          <Button colorScheme="blue" mr={3} onClick={handleGuessCharacter}>
            Guess
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
