import { FC } from 'react'

import { BackGround } from '../BackGround/BackGround'
import styles from './ArrowItem.module.scss'

interface ArrowItemProps {
  isLeftArrow?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  onClick: () => void
}

export const ArrowItem: FC<ArrowItemProps> = ({
  isLeftArrow = true,
  disabled = false,
  size,
  onClick,
}) => {
  return (
    <BackGround size={size}>
      <button
        disabled={disabled}
        className={styles.button}
        onClick={onClick}
      >
        <img
          src='/icons/chevronLeftLight.svg'
          className={isLeftArrow ? '' : styles.right}
        />
      </button>
    </BackGround>
  )
}
