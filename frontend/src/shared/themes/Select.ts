import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    color: 'white',
    backgroundColor: 'brand.800',
    height: '48px',
    borderRadius: '8px',
  },
})

export const selectTheme = defineMultiStyleConfig({ baseStyle })
