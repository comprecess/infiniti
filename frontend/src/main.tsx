import './app/styles/globals.scss'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router.tsx'
import { checkboxTheme } from './shared/themes/CheckBox.ts'
import { menuTheme } from './shared/themes/MenuList.ts'
import { modalTheme } from './shared/themes/Modal.ts'
import { getProfileInfo } from './shared/utils/api/Profile/GetProfileInfo.ts'

const goToRouter = router

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
  await getProfileInfo()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RouterProvider router={goToRouter} />
      </ChakraProvider>
    </React.StrictMode>,
  )
}

main()
