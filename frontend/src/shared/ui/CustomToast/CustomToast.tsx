import { useToast, UseToastOptions } from '@chakra-ui/react'

interface ToastProps {
  title: string
  description: string
  status: 'info' | 'warning' | 'success' | 'error'
}

export const useCustomToast = (): ((options: ToastProps) => void) => {
  const toast = useToast()

  return ({ title, description, status }: ToastProps) => {
    const toastOptions: UseToastOptions = {
      position: 'top',
      title,
      description,
      status,
      duration: 2500,
      isClosable: true,
    }

    toast(toastOptions)
  }
}
