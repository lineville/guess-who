import GameState from "@/gameState";
import { Box, Text } from '@primer/react';
import { Image } from '@primer/react-brand'
import styles from '../styles.module.css'
import { PersonIcon } from "@primer/octicons-react";

export default function Board({ gameState, handleClickCharacter }: { gameState: GameState, handleClickCharacter: (index: number) => void }) {

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
        {gameState.board.map((c, index) => (
          <Box className={c.alive ? styles.imageHover : ''} key={index} sx={{ margin: '8px', padding: '8px', border: c.alive ? '2px solid #000' : '2px solid red', borderRadius: '8px' }} onClick={() => handleClickCharacter(index)}>
            {c.alive ? (
              <>
                <Image src={c.image} alt={c.name} width={120} height={120} />
                <br />
                <Text sx={{ display: 'flex', justifyContent: 'center' }}>{c.name}</Text>
              </>
            ) : (
              <>
                <PersonIcon size={120} />
                <br />
                <Text sx={{ display: 'flex', justifyContent: 'center' }}>{c.name}</Text>
              </>
            )}
          </Box>
        ))}
      </div>
    </div>
  )
}