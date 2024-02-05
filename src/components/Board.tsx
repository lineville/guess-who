import Character from "@/character";
import styles from '../styles.module.css'
import Image from 'next/image'
import { Card, Text, Grid, GridItem, CardBody, CardFooter, Box, useColorMode } from "@chakra-ui/react";

export default function Board({ board, handleClickCharacter, columns }: { board: Character[], handleClickCharacter: (index: number) => void, columns: number }) {
  const { colorMode } = useColorMode();

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={3}>
      {board.map((c, index) => (
        <GridItem key={index} onClick={() => handleClickCharacter(index)}>
          <Box boxSize="12vw">
            <Card className={colorMode === 'light' ? styles.imageHoverLight : styles.imageHoverDark} size="sm" display="flex" justifyContent="center" alignItems="center" w="100%" h="100%">
              <CardBody>
                <Box >
                  <Image src={c.alive ? `/${c.name}.png` : "/question-mark.png"} alt={c.name} width={115} height={115} priority={true} placeholder="empty" />
                </Box>
              </CardBody>
              <CardFooter display="flex" alignItems="center" justifyContent="center">
                <Text>{c.name}</Text>
              </CardFooter>
            </Card>
          </Box>
        </GridItem>
      ))}
    </Grid>
  )
}