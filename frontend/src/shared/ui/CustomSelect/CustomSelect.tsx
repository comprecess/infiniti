import { Select } from '@chakra-ui/react'
import { FC, useEffect } from 'react'

import styles from './CustomSelect.module.scss'

interface CustomSelectProps {
  title: string
  selectedList: string[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  value?: string
  onChange: (value: string) => void
}

export const CustomSelect: FC<CustomSelectProps> = ({
  title,
  selectedList,
  placeholder,
  size = 'md',
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  const camelCaseToTitleCase = (camelCaseString: string): string => {
    const words = camelCaseString
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')

    const capitalizedWords = words.map(
      word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )

    return capitalizedWords.join(' ')
  }

  const checkValue = () => {
    if (value) {
      onChange(value)
    }
  }

  useEffect(() => {
    checkValue()
  }, [])

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <Select
        defaultValue={value}
        fontSize='17px'
        fontWeight='400'
        lineHeight='24px'
        color='gray.400'
        placeholder={placeholder}
        size={size}
        border='none'
        outline='none'
        tabIndex={-1}
        focusBorderColor='brand.500'
        onChange={handleChange}
      >
        {selectedList.map(item => {
          return (
            <option key={item} value={item}>
              {camelCaseToTitleCase(item)}
            </option>
          )
        })}
      </Select>
    </div>
  )
}
