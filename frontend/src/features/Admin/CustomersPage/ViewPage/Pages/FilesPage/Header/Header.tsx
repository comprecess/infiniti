import { Select } from '@chakra-ui/react'
import { FC, useState } from 'react'

import { ViewFileProps } from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './Header.module.scss'

interface HeaderProps {
  groupsList: ViewFileProps[]
  onChange: (value: number) => void
}

export const Header: FC<HeaderProps> = ({ groupsList, onChange }) => {
  const [value, setValue] = useState<number>(0)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(parseInt(event.target.value))
  }

  const addNewFile = () => {
    onChange(value)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.select}>
        <h3 className={styles.title}>Files</h3>
        <Select
          fontSize='17px'
          fontWeight='400'
          lineHeight='24px'
          color='gray.400'
          size='md'
          border='none'
          outline='none'
          tabIndex={-1}
          focusBorderColor='brand.500'
          onChange={handleChange}
        >
          {groupsList.map((item, index) => {
            return (
              <option key={`${item}-${index}`} value={item.id}>
                {item.title}
              </option>
            )
          })}
        </Select>
      </div>
      <ButtonBlue
        title='Submit'
        style={styles.buttonSubmit}
        onClick={addNewFile}
      />
    </div>
  )
}
