import { Switch } from '@chakra-ui/react'
import { FC } from 'react'

interface ToggleProps {
  size?: 'sm' | 'md' | 'lg'
  titleOnChange?: string
  onChange: (
    name: string,
    value: string | number | boolean | null | undefined,
  ) => void
}

export const CustomSwitch: FC<ToggleProps> = ({
  size = 'md',
  titleOnChange = '',
  onChange,
}) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    onChange(titleOnChange, isChecked)
  }

  return <Switch size={size} onChange={handleOnChange} />
}
