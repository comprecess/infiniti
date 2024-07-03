import { FC } from 'react'

import { FiltersState } from '../../../app/constants/constants'
import styles from './FromTo.module.scss'
import { Input } from './Input/Input'

interface FromToProps {
  placeholderFirst: string
  placeholderSecond: string
  filters: FiltersState
  propId: string
  setSelectedFilters: React.Dispatch<React.SetStateAction<FiltersState>>
  title?: string
}

export const FromTo: FC<FromToProps> = ({
  title,
  filters,
  propId,
  placeholderFirst,
  placeholderSecond,
  setSelectedFilters,
}) => {
  const handleInputChange = (index: number, value: string) => {
    const numericValue = value ? parseFloat(value) : null
    setSelectedFilters(prevState => {
      const prevValues = prevState[propId] || [null, null]
      const newValues: (number | null)[] = [...prevValues]
      newValues[index] = numericValue

      const updatedState = { ...prevState }
      if (newValues[0] === null && newValues[1] === null) {
        delete updatedState[propId]
      } else {
        updatedState[propId] = newValues
      }

      return updatedState
    })
  }

  const values = filters[propId] || [null, null]

  return (
    <div className={styles.wrapper}>
      {title && <span className={styles.title}>{title}</span>}
      <div className={styles.inputs}>
        <Input
          isFilters
          placeholder={placeholderFirst}
          value={values[0] !== null ? values[0].toString() : ''}
          onChange={e => handleInputChange(0, e.target.value)}
        />
        <Input
          isFilters
          placeholder={placeholderSecond}
          value={values[1] !== null ? values[1].toString() : ''}
          onChange={e => handleInputChange(1, e.target.value)}
        />
      </div>
    </div>
  )
}
