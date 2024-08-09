import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys)

const baseStyle = definePartsStyle({
  track: {
    bg: 'brand.800',
    _checked: {
      bg: 'brand.500',
    },
  },
})

export const switchTheme = defineMultiStyleConfig({ baseStyle })
