import { FC } from 'react'

import styles from './ButtonBlue.module.scss'

interface ButtonBlueProps {
  title: string
  type?: 'button' | 'submit' | 'reset'
}

export const ButtonBlue: FC<ButtonBlueProps> = ({ title, type }) => {
  return (
    <button className={styles.wrapper} type={type}>
      {title}
    </button>
  )
}
