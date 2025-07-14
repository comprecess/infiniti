import { Center, Divider } from '@chakra-ui/react'

interface CustomDividerProps {
  styles?: string
  color?: string
  orientation?: 'horizontal' | 'vertical'
}

export const CustomDivider = ({
  styles,
  color = '#343543',
  orientation = 'horizontal',
}: CustomDividerProps) => {
  return (
    <Center
      className={styles}
      maxHeight={orientation === 'vertical' ? '340px' : ''}
    >
      <Divider
        borderColor={color}
        orientation={orientation ? orientation : 'horizontal'}
      />
    </Center>
  )
}
