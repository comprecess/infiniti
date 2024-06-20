import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    width: '100%',
  },
  control: {
    width: 5,
    height: 5,
    borderRadius: 4,
    border: 'none',
    backgroundColor: 'gray.500',
  },
  label: {
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

export const checkboxTheme = defineMultiStyleConfig({ baseStyle })
