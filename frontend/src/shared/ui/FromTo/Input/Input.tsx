import { ChangeEvent, FC } from 'react'

import styles from './Input.module.scss'

interface InputProps {
  placeholder: string
  tabIndex?: number
  value?: string
  style?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = ({
  placeholder,
  tabIndex,
  value,
  style,
  onChange,
}) => {
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
