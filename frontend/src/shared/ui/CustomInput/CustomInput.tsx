import { FC, useEffect, useState } from 'react'

import styles from './CustomInput.module.scss'

interface CustomInputProps {
  title?: string
  id?: string
  name?: string
  type: string
  placeHolder?: string
  value?: string | null
  readOnly?: boolean
  onChange: (name: string, value: string) => void
}

export const CustomInput: FC<CustomInputProps> = ({
  id,
  title,
  name,
  type,
  placeHolder,
  value = null,
  readOnly = false,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string | null>(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    setInputValue(newValue)
    onChange(id!, newValue)
  }

  useEffect(() => {
    if (value !== null) {
      onChange(id!, value)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      {title && (
        <label htmlFor={id} className={styles.title}>
          {title}
        </label>
      )}
      <div className={styles.wrapperInput}>
        <input
          id={id}
          name={name}
          type={type}
          readOnly={readOnly}
          tabIndex={-1}
          value={inputValue ?? ''}
          placeholder={placeHolder}
          className={styles.input}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
