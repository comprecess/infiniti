import { Divider } from '@chakra-ui/react'
import { FC } from 'react'

interface CustomDividerProps {
  color?: string
}

export const CustomDivider: FC<CustomDividerProps> = ({
  color = '#343543',
}) => {
  return <Divider borderColor={color} orientation='horizontal' />
}
