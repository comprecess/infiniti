import './app/styles/globals.scss'

import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router.tsx'
import { getProfileInfo } from './shared/utils/api/Profile/GetProfileInfo.ts'

const goToRouter = router

async function main() {
  await getProfileInfo()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ChakraProvider>
        <RouterProvider router={goToRouter} />
      </ChakraProvider>
    </React.StrictMode>,
  )
}

main()
