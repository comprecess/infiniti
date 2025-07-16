import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface CustomModalWindowProps {
  isOpen: boolean
  onClose: () => void
  maxWidth?: string
  padding?: string
  backgroundColor?: string
  borderRadius?: string
}

export const CustomModalWindow = ({
  isOpen,
  onClose,
  maxWidth,
  backgroundColor,
  borderRadius,
  padding,
  children,
}: PropsWithChildren<CustomModalWindowProps>) => {
  return (
    <Modal
      isCentered
      blockScrollOnMount
      preserveScrollBarGap
      isOpen={isOpen}
      autoFocus={false}
      motionPreset='scale'
      trapFocus={false}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent
        maxWidth={maxWidth}
        style={{ padding, backgroundColor, borderRadius }}
      >
        {children}
      </ModalContent>
    </Modal>
  )
}
