import { Checkbox } from '@chakra-ui/react'
import { FC } from 'react'

interface CheckBoxProps {
  title: string
  titleOnChange?: string
  isChecked?: boolean
  isIndeterminate?: boolean
  defaultChecked?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onInputChange?: (name: string, isChecked: boolean) => void
}

export const CustomCheckBox: FC<CheckBoxProps> = ({
  title,
  titleOnChange = null,
  isChecked,
  isIndeterminate,
  defaultChecked = false,
  onChange,
  onInputChange,
}) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
