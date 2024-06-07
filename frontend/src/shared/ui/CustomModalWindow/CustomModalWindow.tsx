import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

interface CustomModalWindowProps {
  isOpen: boolean
  onClose: () => void
  maxWidth?: string
}

export const CustomModalWindow: FC<
PropsWithChildren<CustomModalWindowProps>
> = ({ isOpen, onClose, maxWidth, children }) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={maxWidth}>{children}</ModalContent>
    </Modal>
  )
}
