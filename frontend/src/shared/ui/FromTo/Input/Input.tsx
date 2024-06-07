import { FC } from 'react'

import styles from './Input.module.scss'

interface InputProps {
  placeholder: string
  style?: string
}

export const Input: FC<InputProps> = ({ placeholder, style }) => {
  return (
    <input
      type='number'
      placeholder={placeholder}
      className={`${styles.input} ${style}`}
    />
  )
}
