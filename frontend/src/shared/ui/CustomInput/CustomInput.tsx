import { ChangeEvent, useEffect, useState } from 'react'

import styles from './CustomInput.module.scss'

interface CustomInputProps {
  title?: string
  id?: string
  name?: string
  type: string
  placeHolder?: string
  value?: number | string | null
  onInputChange?: boolean
  readOnly?: boolean
  styleInput?: string
  min?: number
  max?: number
  onChange: (name: string, value: string | number) => void
}

export const CustomInput = ({
  id,
  title,
  name,
  type,
  placeHolder,
  value = null,
  onInputChange = true,
  readOnly = false,
  styleInput,
  min,
  max,
  onChange,
}: CustomInputProps) => {
  const [inputValue, setInputValue] = useState<number | string | null>(value)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    setInputValue(newValue)
    onChange(id!, newValue)
  }

  useEffect(() => {
    if (value !== null && onInputChange) {
      onChange(id!, value)
    }
  }, [])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className={styles.wrapper}>
      {title && (
        <label htmlFor={id} className={styles.title}>
          {title}
        </label>
      )}
      <div className={`${styles.wrapperInput} ${styleInput}`}>
        <input
          id={id}
          name={name}
          type={type}
          readOnly={readOnly}
          tabIndex={-1}
          min={min}
          max={max}
          value={inputValue ?? ''}
          placeholder={placeHolder}
          className={`${styles.input} ${styleInput}`}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
