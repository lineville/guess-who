import Character from "@/character";
import styles from "../styles.module.css";
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
} from "@chakra-ui/react";

export default function Board({
  board,
  handleClickCharacter,
  columns,
}: {
  board: Character[];
  handleClickCharacter: (index: number) => void;
  columns: number;
}) {
  const { colorMode } = useColorMode();

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={3}>
      {board.map((c, index) => (
        <GridItem key={index} onClick={() => handleClickCharacter(index)}>
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
              w={["120", "150"]}
              h={["150", "180"]}
            >
              <CardBody p={2}>
                <Box>
                  <Image
                    src={c.alive ? `/${c.name}.png` : "/question-mark.png"}
                    alt={c.name}
                    placeholder="empty"
                    priority={true}
                    sizes="(max-width: 768px) 100px, 130px"
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                </Box>
              </CardBody>
              <CardFooter
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
              >
                <Text fontSize={["10px", "20px"]} maxW={["100", "300"]}>
                  {c.name}
                </Text>
              </CardFooter>
            </Card>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
}
