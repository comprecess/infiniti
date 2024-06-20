import { FC, useState } from 'react'

import styles from './CustomInput.module.scss'

interface CustomInputProps {
  title: string
  name?: string
  type: string
  placeHolder?: string
  value?: string
}

export const CustomInput: FC<CustomInputProps> = ({
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
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.wrapperInput}>
        <input
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
