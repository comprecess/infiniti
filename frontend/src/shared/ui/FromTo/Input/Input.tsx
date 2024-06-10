import { FC } from 'react'

import styles from './Input.module.scss'

interface InputProps {
  placeholder: string
  tabIndex?: number
  style?: string
}

export const Input: FC<InputProps> = ({
  placeholder,
  tabIndex,
  style,
}) => {
  return (
    <input
      type='number'
      placeholder={placeholder}
      className={`${styles.input} ${style}`}
      tabIndex={tabIndex}
    />
  )
}
