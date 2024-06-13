import { Spinner } from '@chakra-ui/react'
import { FC } from 'react'

interface LoadingSpinnerProps {
  color?: string
  size?: string
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  color = 'brand.500',
  size = 'lg',
}) => {
  return (
    <Spinner
      color={color}
      size={size}
      speed='1s'
      thickness='4px'
    />
  )
}
