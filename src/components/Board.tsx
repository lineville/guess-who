import Character from "@/lib/character";
import { GameType } from "@/lib/gameType";
import { CheckIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Grid,
  GridItem,
  IconButton,
  SlideFade,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import FlipCard from "react-card-flip";
import styles from "../styles/styles.module.css";

interface BoardProps {
  board: Character[];
  handleEliminateCharacter: (index: number) => void;
  handleGuessCharacter: (index: number) => void;
  handleReviveCharacter: (index: number) => void;
  columns: number;
  gameType: GameType;
  isMobile?: boolean;
}

export default function Board({
  board,
  handleEliminateCharacter,
  handleGuessCharacter,
  handleReviveCharacter,
  columns,
  gameType,
  isMobile,
}: BoardProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      gap={2}
      rowGap={2}
      data-testid="board"
      p={2}
    >
      {board.map((c, index) => (
        <GridItem key={index}>
          <SlideFade in={true} offsetX={"-200vw"}>
            <Box>
              <Card
                className={
                  colorMode === "light"
                    ? styles.imageHoverLight
                    : styles.imageHoverDark
                }
                display="flex"
                justifyContent="center"
                alignItems="center"
                w={["115px", "180px"]}
                h={["115px", "150px"]}
              >
                <CardBody p={2}>
                  <FlipCard isFlipped={!c.alive} flipDirection="vertical">
                    <Image
                      src={`/${gameType}/${c.name}.png`}
                      alt={c.name}
                      placeholder="empty"
                      priority={true}
                      width={isMobile ? 50 : 80}
                      height={isMobile ? 50 : 80}
                      sizes="(max-width: 768px) 100px, 130px"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />

                    <Image
                      src="/question-mark.png"
                      alt="question mark"
                      placeholder="empty"
                      priority={true}
                      width={isMobile ? 50 : 80}
                      height={isMobile ? 50 : 80}
                      sizes="(max-width: 768px) 100px, 130px"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </FlipCard>
                </CardBody>
                <CardFooter
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="100%"
                  h="100%"
                  p={0}
                >
                  {c.alive ? (
                    <IconButton
                      aria-label="Eliminate"
                      icon={<ViewOffIcon />}
                      onClick={() => handleEliminateCharacter(index)}
                      size="sm"
                    />
                  ) : (
                    <IconButton
                      aria-label="Revive"
                      icon={<ViewIcon />}
                      onClick={() => handleReviveCharacter(index)}
                      size="sm"
                    />
                  )}
                  <Text
                    fontSize={["10px", "20px"]}
                    maxW={["100", "300"]}
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    mx={isMobile ? 1 : 2}
                  >
                    {c.name}
                  </Text>
                  <IconButton
                    aria-label="Guess"
                    icon={<CheckIcon />}
                    onClick={() => handleGuessCharacter(index)}
                    size="sm"
                  />
                </CardFooter>
              </Card>
            </Box>
          </SlideFade>
        </GridItem>
      ))}
    </Grid>
  );
}
