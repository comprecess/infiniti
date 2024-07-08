import { Switch } from '@chakra-ui/react'
import { FC } from 'react'

interface ToggleProps {
  size?: 'sm' | 'md' | 'lg'
}

export const CustomSwitch: FC<ToggleProps> = ({ size = 'md' }) => {
  return <Switch size={size} />
}
