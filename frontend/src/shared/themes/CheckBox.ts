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
    backgroundColor: 'gray.500',
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

export const checkboxTheme = defineMultiStyleConfig({ baseStyle })
