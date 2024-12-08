import Character from "@/lib/character";
import styles from "../styles/styles.module.css";
import Image from "next/image";
import {
  Card,
  Text,
  Grid,
  GridItem,
  CardBody,
  CardFooter,
  Box,
  useColorMode,
  SlideFade,
  IconButton,
} from "@chakra-ui/react";
import FlipCard from "react-card-flip";
import { GameType } from "@/lib/gameType";
import { CheckIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface BoardProps {
  board: Character[];
  handleEliminateCharacter: (index: number) => void;
  handleGuessCharacter: (index: number) => void;
  handleReviveCharacter: (index: number) => void;
  columns: number;
  gameType: GameType;
}

export default function Board({
  board,
  handleEliminateCharacter,
  handleGuessCharacter,
  handleReviveCharacter,
  columns,
  gameType,
}: BoardProps): JSX.Element {
  const { colorMode } = useColorMode();

  // TODO: fix mobile view with these grid changes
  return (
    <Box
      borderRadius="lg"
      style={{ background: "linear-gradient(to right, red.500 0%, blue.500 100%)" }}
      p="6px"
    >
      <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      gap={1}
      rowGap={2}
      data-testid="board"
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
            w={["120px", "195px"]}
            h={["150px", "180px"]}
          >
            <CardBody p={2}>
            <FlipCard isFlipped={!c.alive} flipDirection="vertical">
              <Image
              src={`/${gameType}/${c.name}.png`}
              alt={c.name}
              placeholder="empty"
              priority={true}
              width={100}
              height={100}
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
              width={100}
              height={100}
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
              overflow: "hidden",
              textOverflow: "ellipsis",
              }}
              mx={2}
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
    </Box>
  );
}
