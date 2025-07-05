import { Checkbox } from '@chakra-ui/react'
import { ChangeEvent } from 'react'

interface CheckBoxProps {
  title?: string
  titleOnChange?: string | null
  isChecked?: boolean
  isIndeterminate?: boolean
  defaultChecked?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onInputChange?: (name: string, isChecked: boolean) => void
}

export const CustomCheckBox = ({
  title,
  titleOnChange = null,
  isChecked,
  isIndeterminate,
  defaultChecked = false,
  onChange,
  onInputChange,
}: CheckBoxProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (titleOnChange && onInputChange) {
      onInputChange(titleOnChange, event.target.checked)
    } else if (onChange) {
      onChange(event)
    }
  }

  return (
    <Checkbox
      iconSize='16px'
      iconColor='white'
      colorScheme='brand'
      isChecked={isChecked}
      defaultChecked={defaultChecked}
      isIndeterminate={isIndeterminate}
      tabIndex={-1}
      sx={{
        '&:focus': {
          outline: 'none',
        },
      }}
      onChange={handleOnChange}
    >
      {title}
    </Checkbox>
  )
}
