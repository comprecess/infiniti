import './app/styles/globals.scss'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import { checkboxTheme } from './shared/themes/CheckBox.ts'
import { menuTheme } from './shared/themes/MenuList.ts'
import { modalTheme } from './shared/themes/Modal.ts'

const theme = extendTheme({
  components: {
    Checkbox: checkboxTheme,
    Menu: menuTheme,
    Modal: modalTheme,
  },
  colors: {
    brand: {
      1000: '#0f1119',
      900: '#151720',
      800: '#1b1e29',
      700: '#1d2687',
      500: '#303fe1',
      400: '#5965e7',
      300: '#838ced',
    },
    lightBrand: {
      800: '#2d303a',
    },
    gray: {
      500: '#343543',
      400: '#55586e',
      200: '#9ea0b7',
    },
  },
})

async function main() {
  const rootElement = document.getElementById('root')

  if (!rootElement) return

  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  )
}

main()
