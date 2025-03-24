import { HTMLProps } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

import styles from './Input.module.scss'

interface InputProps extends HTMLProps<HTMLInputElement> {
  title?: string
  typeInput?: 'white' | 'brand'
  id: string
  name: string
  type: string
  register: UseFormRegister<any>
  placeholder?: string
  disabled?: boolean
  validationRules?: RegisterOptions
}

export const Input = ({
  title,
  placeholder,
  typeInput = 'white',
  id,
  name,
  type,
  disabled = false,
  validationRules,
  register,
}: InputProps) => {
  return (
    <div className={styles.wrapper}>
      {title && (
        <label className={styles.title} htmlFor={id}>
          {title}
        </label>
      )}
      <input
        disabled={disabled}
        placeholder={placeholder}
        id={id}
        type={type}
        className={
          typeInput === 'white'
            ? styles.inputWhite
            : typeInput === 'brand'
              ? styles.inputBrand
              : ''
        }
        {...register(name, validationRules)}
      />
    </div>
  )
}
