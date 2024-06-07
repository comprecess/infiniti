import { Center, Divider } from '@chakra-ui/react'
import { FC } from 'react'

interface CustomDividerProps {
  color?: string
  orientation?: 'horizontal' | 'vertical'
}

export const CustomDivider: FC<CustomDividerProps> = ({
  color = '#343543',
  orientation,
}) => {
  return (
    <Center maxHeight={orientation === 'vertical' ? '340px' : ''}>
      <Divider
        borderColor={color}
        orientation={orientation ? orientation : 'horizontal'}
      />
    </Center>
  )
}
