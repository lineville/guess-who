import Character from "@/character";
import styles from '../styles.module.css'
import { Image, Card, Text, Grid, GridItem, CardBody, CardFooter, Box, useColorMode } from "@chakra-ui/react";

export default function Board({ board, handleClickCharacter, columns }: { board: Character[], handleClickCharacter: (index: number) => void, columns: number }) {
  const { colorMode } = useColorMode();

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={3}>
      {board.map((c, index) => (
        <GridItem key={index} onClick={() => handleClickCharacter(index)}>
          <Box>
            <Card className={colorMode === 'light' ? styles.imageHoverLight : styles.imageHoverDark} display="flex" justifyContent="center" alignItems="center" w="100%" h="100%">
              <CardBody p={2}>
                <Box>
                  <Image src={c.alive ? `/${c.name}.png` : "/question-mark.png"} alt={c.name} fallbackSrc={"/question-mark.png"} w={['100', '130']} h={['100', '130']} objectFit="cover" />
                </Box>
              </CardBody>
              <CardFooter display="flex" alignItems="center" justifyContent="center">
                <Text fontSize={['12px', '20px']}>{c.name}</Text>
              </CardFooter>
            </Card>
          </Box>
        </GridItem>
      ))}
    </Grid>
  )
}