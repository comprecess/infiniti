import { Dispatch, SetStateAction } from 'react'

import styles from './FromTo.module.scss'
import { Input } from './Input/Input'
import { FiltersState } from '../../../app/constants/constants'

interface FromToProps {
  placeholderFirst: string
  placeholderSecond: string
  filters: FiltersState
  propId: string
  title?: string
  setSelectedFilters: Dispatch<SetStateAction<FiltersState>>
}

export const FromTo = ({
  title,
  filters,
  propId,
  placeholderFirst,
  placeholderSecond,
  setSelectedFilters,
}: FromToProps) => {
  const handleInputChange = (index: number, value: string) => {
    const numericValue = value ? parseFloat(value) : null
    setSelectedFilters(prevState => {
      const prevValues = prevState[propId] || [null, null]
      const newValues: (string | number | null)[] = [...prevValues]
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
          placeholder={placeholderFirst}
          value={values[0] !== null ? values[0].toString() : ''}
          onChange={e => handleInputChange(0, e.target.value)}
        />
        <Input
          placeholder={placeholderSecond}
          value={values[1] !== null ? values[1].toString() : ''}
          onChange={e => handleInputChange(1, e.target.value)}
        />
      </div>
    </div>
  )
}
