import { FC } from 'react'

import { BackGround } from '../BackGround/BackGround'
import styles from './NumberItem.module.scss'

interface NumberItemProps {
  number: number
  isActive: boolean
  onClick: () => void
}

export const NumberItem: FC<NumberItemProps> = ({
  number,
  isActive,
  onClick,
}) => {
  return (
    <BackGround isActive={isActive}>
      <div className={styles.wrapper} onClick={onClick}>
        <span className={styles.number}>{number}</span>
      </div>
    </BackGround>
  )
}
