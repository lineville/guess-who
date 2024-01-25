import Character from "@/character";
import styles from '../styles.module.css'
import Image from 'next/image'

export default function Board({ board, handleClickCharacter }: { board: Character[], handleClickCharacter: (index: number) => void }) {

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
        {board.map((c, index) => (
          <div className={c.alive ? styles.imageHover : ''} key={index} style={{ margin: '8px', padding: '8px', border: c.alive ? '2px solid #000' : '2px solid red', borderRadius: '8px' }} onClick={() => handleClickCharacter(index)}>
            {c.alive ? (
              <>
                <Image src={c.image} alt={c.name} width={90} height={90} />
                <br />
                <span style={{ display: 'flex', justifyContent: 'center' }}>{c.name}</span>
              </>
            ) : (
              <>
              {/* TODO back of card */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}