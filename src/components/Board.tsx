import Character from "@/character";
import styles from '../styles.module.css'
import Image from 'next/image'
import { Card, Text, Grid, GridItem, CardBody, CardFooter } from "@chakra-ui/react";

export default function Board({ board, handleClickCharacter, rows, columns }: { board: Character[], handleClickCharacter: (index: number) => void, rows: number, columns: number }) {

  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={columns}>
      {board.map((c, index) => (
        <GridItem key={index} onClick={() => handleClickCharacter(index)}>
          <Card className={styles.imageHover} size="lg">
            <CardBody>
              <Image src={c.alive ? c.image : "/question-mark.png"} alt={c.name} width={120} height={120} />
            </CardBody>
            <CardFooter display="flex" alignItems="center" justifyContent="center">
              <Text>{c.name}</Text>
            </CardFooter>
          </Card>
        </GridItem>
      ))}
    </Grid>
  )
}