import { FC } from 'react'

import styles from './ButtonBlue.module.scss'

interface ButtonBlueProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export const ButtonBlue: FC<ButtonBlueProps> = ({
  title,
  type,
  onClick,
}) => {
  return (
    <button className={styles.wrapper} type={type} onClick={onClick}>
      {title}
    </button>
  )
}
