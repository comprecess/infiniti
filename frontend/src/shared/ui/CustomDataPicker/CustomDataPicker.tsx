import './Theme.scss'

import { FC, useState } from 'react'
import DatePicker from 'react-datepicker'

import styles from './CustomDataPicker.module.scss'

interface CustomDataPickerProps {
  title: string
  onChange: (name: string, value: string) => void
}

export const CustomDataPicker: FC<CustomDataPickerProps> = ({
  title,
  onChange,
}) => {
  const [date, setDate] = useState<Date>()

  const handleOnChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate)

      const year = newDate.getFullYear()
      const month = String(newDate.getMonth() + 1).padStart(2, '0')
      const day = String(newDate.getDate()).padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`

      onChange('date', formattedDate)
    }
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <DatePicker
        selected={date}
        dateFormat='yyyy-MM-dd'
        onChange={date => handleOnChange(date)}
      />
    </div>
  )
}
