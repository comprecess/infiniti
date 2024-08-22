import { Select } from '@chakra-ui/react'
import { FC, useEffect } from 'react'

import styles from './CustomSelect.module.scss'

interface CustomSelectProps {
  title: string
  titleOnChange?: string
  selectedList: string[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  value?: string
  camelCase?: boolean
  onChange: (name: string, value: string) => void
}

export const CustomSelect: FC<CustomSelectProps> = ({
  title,
  selectedList,
  titleOnChange = '',
  placeholder,
  size = 'md',
  value,
  camelCase = false,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(titleOnChange, event.target.value)
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
      onChange(titleOnChange, value)
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
        {selectedList.map((item, index) => {
          return (
            <option key={`${item}-${index}`} value={item}>
              {camelCase ? camelCaseToTitleCase(item) : item}
            </option>
          )
        })}
      </Select>
    </div>
  )
}
