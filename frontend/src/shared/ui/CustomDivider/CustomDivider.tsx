import { Center, Divider } from '@chakra-ui/react'

interface CustomDividerProps {
  color?: string
  orientation?: 'horizontal' | 'vertical'
}

export const CustomDivider = ({
  color = '#343543',
  orientation = 'horizontal',
}: CustomDividerProps) => {
  return (
    <Center maxHeight={orientation === 'vertical' ? '340px' : ''}>
      <Divider
        borderColor={color}
        orientation={orientation ? orientation : 'horizontal'}
      />
    </Center>
  )
}
