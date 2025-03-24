import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface CustomModalWindowProps {
  isOpen: boolean
  onClose: () => void
  maxWidth?: string
}

export const CustomModalWindow = ({
  isOpen,
  onClose,
  maxWidth,
  children,
}: PropsWithChildren<CustomModalWindowProps>) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={maxWidth}>{children}</ModalContent>
    </Modal>
  )
}
