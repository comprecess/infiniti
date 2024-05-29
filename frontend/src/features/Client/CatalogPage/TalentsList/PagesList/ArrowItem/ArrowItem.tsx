import { FC } from 'react'

import { BackGround } from '../BackGround/BackGround'
import styles from './ArrowItem.module.scss'

interface ArrowItemProps {
  isLeftArrow?: boolean
  disabled: boolean
  onClick: () => void
}

export const ArrowItem: FC<ArrowItemProps> = ({
  isLeftArrow = true,
  disabled,
  onClick,
}) => {
  return (
    <BackGround>
      <button
        disabled={disabled}
        className={styles.button}
        onClick={onClick}
      >
        <img
          src='/icons/chevronLeftLight.svg'
          alt=''
          className={isLeftArrow ? '' : styles.right}
        />
      </button>
    </BackGround>
  )
}
