import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { FC } from 'react'

import styles from './CustomRadio.module.scss'

interface CustomRadioProps {
  title: string
  radioList: string[]
  direction?: 'column' | 'row'
  defaultValue?: string
  onChange: (value: string) => void
}

export const CustomRadio: FC<CustomRadioProps> = ({
  title,
  direction = 'row',
  radioList,
  defaultValue,
  onChange,
}) => {
  const handleChange = (value: string) => {
    onChange(value)
  }

  return (
    <>
      <span className={styles.title}>{title}</span>
      <RadioGroup
        defaultValue={defaultValue}
        fontSize='17px'
        fontWeight='400'
        lineHeight='24px'
        _focus={{ border: 'none' }}
        onChange={handleChange}
      >
        <Stack direction={direction}>
          {radioList.map(item => {
            return (
              <Radio key={item} value={item}>
                {item}
              </Radio>
            )
          })}
        </Stack>
      </RadioGroup>
    </>
  )
}
