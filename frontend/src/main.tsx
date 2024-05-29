import './app/styles/globals.scss'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router.tsx'
import { checkboxTheme } from './shared/themes/CheckBox.ts'
import { getProfileInfo } from './shared/utils/api/Profile/GetProfileInfo.ts'

const goToRouter = router

const theme = extendTheme({
  components: {
    Checkbox: checkboxTheme,
  },
  colors: {
    brand: {
      500: '#303fe1',
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
