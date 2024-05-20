import './app/styles/globals.scss'

import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router.tsx'

const goToRouter = router

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={goToRouter} />
    </ChakraProvider>
  </React.StrictMode>,
)
