import { FC } from 'react'

import { BackGround } from '../BackGround/BackGround'
import styles from './NumberItem.module.scss'

interface NumberItemProps {
  number: number
  isActive: boolean
  size?: 'sm' | 'md'
  onClick: () => void
}

export const NumberItem: FC<NumberItemProps> = ({
  number,
  isActive,
  size = 'md',
  onClick,
}) => {
  const sizeClass = size === 'md' ? styles.numberMD : styles.numberSM

  return (
    <BackGround isActive={isActive} size={size}>
      <div className={styles.wrapper} onClick={onClick}>
        <span className={sizeClass}>{number}</span>
      </div>
    </BackGround>
  )
}
