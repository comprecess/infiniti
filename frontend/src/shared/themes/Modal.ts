import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'rgba(15, 17, 25, 0.8)',
  },
  dialogContainer: {
    padding: '20px',
  },
  dialog: {
    borderRadius: '8px',
    padding: '32px',
    bg: `brand.900`,
    shadow: 'none',
  },
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})
