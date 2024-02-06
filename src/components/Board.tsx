import Character from "@/character";
import styles from '../styles.module.css'
// import Image from 'next/image'
import { Image, Card, Heading, Grid, GridItem, CardBody, CardFooter, Box, useColorMode } from "@chakra-ui/react";

export default function Board({ board, handleClickCharacter, columns }: { board: Character[], handleClickCharacter: (index: number) => void, columns: number }) {
  const { colorMode } = useColorMode();

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={3}>
      {board.map((c, index) => (
        <GridItem key={index} onClick={() => handleClickCharacter(index)}>
          <Box minH="100px" minW="100px">
            <Card className={colorMode === 'light' ? styles.imageHoverLight : styles.imageHoverDark} display="flex" justifyContent="center" alignItems="center" w="100%" h="100%">
              <CardBody>
                <Box>
                  <Image src={c.alive ? `/${c.name}.png` : "/question-mark.png"} alt={c.name} fallbackSrc={"/question-mark.png"} />
                </Box>
              </CardBody>
              <CardFooter display="flex" alignItems="center" justifyContent="center">
                <Heading size="md">{c.name}</Heading>
              </CardFooter>
            </Card>
          </Box>
        </GridItem>
      ))}
    </Grid>
  )
}