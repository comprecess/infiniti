import { FC, HTMLProps } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

import styles from './Input.module.scss'

interface InputProps extends HTMLProps<HTMLInputElement> {
  title: string
  id: string
  name: string
  type: string
  register: UseFormRegister<any>
  placeholder?: string
  validationRules?: RegisterOptions
}

export const Input: FC<InputProps> = ({
  title,
  placeholder,
  id,
  name,
  type,
  register,
  validationRules,
}) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.title} htmlFor={id}>
        {title}
      </label>
      <input
        className={styles.input}
        placeholder={placeholder}
        id={id}
        type={type}
        {...register(name, validationRules)}
      />
    </div>
  )
}
