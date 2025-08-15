import { Switch } from '@chakra-ui/react'
import { ChangeEvent } from 'react'

interface ToggleProps {
  size?: 'sm' | 'md' | 'lg'
  titleOnChange?: string
  isChecked?: boolean
  onChange: (
    name: string,
    value: string | number | boolean | null | undefined,
  ) => void
}

export const CustomSwitch = ({
  size = 'md',
  titleOnChange = '',
  isChecked,
  onChange,
}: ToggleProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked

    onChange(titleOnChange, isChecked)
  }

  return (
    <Switch isChecked={isChecked} size={size} onChange={handleOnChange} />
  )
}
