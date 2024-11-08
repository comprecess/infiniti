import { Select } from '@chakra-ui/react'
import { FC, useEffect } from 'react'

import styles from './CustomSelect.module.scss'

interface CustomSelectProps {
  title?: string
  titleOnChange?: string
  idList: number[]
  nameList: string[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  value?: number
  height?: string
  onInputChange?: boolean
  camelCase?: boolean
  onChange: (name: string, value: number) => void
}

export const CustomSelect: FC<CustomSelectProps> = ({
  title,
  idList,
  nameList,
  titleOnChange = '',
  placeholder,
  size = 'md',
  value,
  height,
  onInputChange = true,
  camelCase = false,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(titleOnChange, Number(event.target.value))
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
    if (value && onInputChange) {
      onChange(titleOnChange, value)
    }
  }

  useEffect(() => {
    checkValue()
  }, [])

  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <Select
        defaultValue={value}
        fontSize='17px'
        fontWeight='400'
        lineHeight='24px'
        color='gray.400'
        placeholder={placeholder}
        size={size}
        height={height ? height : undefined}
        border='none'
        outline='none'
        tabIndex={-1}
        focusBorderColor='brand.500'
        onChange={handleChange}
      >
        {nameList.map((item, index) => {
          return (
            <option key={idList[index]} value={idList[index]}>
              {camelCase ? camelCaseToTitleCase(item) : item}
            </option>
          )
        })}
      </Select>
    </div>
  )
}
