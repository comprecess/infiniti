import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys)

const baseStyle = definePartsStyle({
  track: {
    bg: 'gray.200',
    _checked: {
      bg: 'mint.400',
    },
  },
})

export const switchTheme = defineMultiStyleConfig({ baseStyle })
