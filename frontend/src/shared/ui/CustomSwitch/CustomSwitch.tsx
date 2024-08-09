import { Switch } from '@chakra-ui/react'
import { FC } from 'react'

interface ToggleProps {
  size?: 'sm' | 'md' | 'lg'
  titleOnChange?: string
  isChecked?: boolean
  onChange: (
    name: string,
    value: string | number | boolean | null | undefined,
  ) => void
}

export const CustomSwitch: FC<ToggleProps> = ({
  size = 'md',
  titleOnChange = '',
  isChecked,
  onChange,
}) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    onChange(titleOnChange, isChecked)
  }

  return (
    <Switch
      defaultChecked={isChecked}
      size={size}
      onChange={handleOnChange}
    />
  )
}
