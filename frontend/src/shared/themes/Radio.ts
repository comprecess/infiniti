import { radioAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys)

const baseStyle = definePartsStyle({
  control: {
    w: 6,
    h: 6,
    borderRadius: 'md',
    borderColor: 'brand.800',

    _checked: {
      borderColor: 'brand.500',
    },

    _hover: {
      borderColor: 'brand.500',
    },
  },
})

export const radioTheme = defineMultiStyleConfig({ baseStyle })
