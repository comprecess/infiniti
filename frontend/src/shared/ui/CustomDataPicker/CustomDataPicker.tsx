import './Theme.scss'

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

import styles from './CustomDataPicker.module.scss'

interface CustomDataPickerProps {
  title: string
  titleOnChange: string
  value?: string
  onChange: (name: string, value: string) => void
}

export const CustomDataPicker = ({
  title,
  titleOnChange,
  value = '',
  onChange,
}: CustomDataPickerProps) => {
  const [date, setDate] = useState<Date | null>(null)

  const handleOnChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate)

      const year = newDate.getFullYear()
      const month = String(newDate.getMonth() + 1).padStart(2, '0')
      const day = String(newDate.getDate()).padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`

      onChange(titleOnChange, formattedDate)
    } else {
      setDate(null)
      onChange(titleOnChange, '')
    }
  }

  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value)

      setDate(isNaN(parsedDate.getTime()) ? null : parsedDate)
    }
  }, [value])

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <DatePicker
        selected={date}
        dateFormat='yyyy-MM-dd'
        onChange={handleOnChange}
      />
    </div>
  )
}
