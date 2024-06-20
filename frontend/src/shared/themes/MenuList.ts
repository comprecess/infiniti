import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  list: {
    bg: 'brand.800',
    border: 'none',
    maxHeight: '250px',
    overflowY: 'auto',
  },
  item: {
    color: 'white',
    bg: 'brand.800',
    _hover: {
      bg: 'brand.500',
    },
  },
})

export const menuTheme = defineMultiStyleConfig({ baseStyle })
