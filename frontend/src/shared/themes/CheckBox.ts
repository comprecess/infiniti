import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const baseStyle = definePartsStyle({
  control: {
    width: 5,
    height: 5,
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#343543',
  },
})

export const checkboxTheme = defineMultiStyleConfig({ baseStyle })
