import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    backgroundColor: 'brand.800',
    height: '48px',
  },
})

export const selectTheme = defineMultiStyleConfig({ baseStyle })
