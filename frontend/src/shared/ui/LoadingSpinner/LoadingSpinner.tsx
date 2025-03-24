import { Spinner } from '@chakra-ui/react'

interface LoadingSpinnerProps {
  color?: string
  size?: string
}

export const LoadingSpinner = ({
  color = 'brand.500',
  size = 'lg',
}: LoadingSpinnerProps) => {
  return (
    <Spinner
      color={color}
      size={size}
      speed='1s'
      thickness='4px'
    />
  )
}
