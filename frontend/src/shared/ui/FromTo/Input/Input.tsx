import { ChangeEvent } from 'react'

import styles from './Input.module.scss'

interface InputProps {
  placeholder: string
  tabIndex?: number
  value?: string
  style?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({
  placeholder,
  tabIndex,
  value,
  style,
  onChange,
}: InputProps) => {
  return (
    <input
      type='number'
      value={value}
      placeholder={placeholder}
      className={`${styles.input} ${style}`}
      tabIndex={tabIndex}
      onChange={onChange}
    />
  )
}
