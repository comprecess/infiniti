import { Checkbox } from '@chakra-ui/react'
import { FC } from 'react'

interface CheckBoxProps {
  title: string
  isChecked?: boolean
  isIndeterminate?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const CustomCheckBox: FC<CheckBoxProps> = ({
  title,
  isChecked,
  isIndeterminate,
  onChange,
}) => {
  return (
    <Checkbox
      iconSize='16px'
      iconColor='white'
      isChecked={isChecked}
      isIndeterminate={isIndeterminate}
      onChange={onChange}
    >
      {title}
    </Checkbox>
  )
}
