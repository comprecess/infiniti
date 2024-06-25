import { FC, useState } from 'react'

import styles from './CustomInput.module.scss'

interface CustomInputProps {
  title: string
  id?: string
  name?: string
  type: string
  placeHolder?: string
  value?: string
}

export const CustomInput: FC<CustomInputProps> = ({
  id,
  title,
  name,
  type,
  placeHolder,
  value = null,
}) => {
  const [inputValue, setInputValue] = useState<string | null>(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.title}>
        {title}
      </label>
      <div className={styles.wrapperInput}>
        <input
          id={id}
          name={name}
          type={type}
          value={inputValue ?? ''}
          placeholder={placeHolder}
          className={styles.input}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
