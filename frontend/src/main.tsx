import './app/styles/globals.scss'
import './i18n'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import { checkboxTheme } from './shared/themes/CheckBox.ts'
import { menuTheme } from './shared/themes/MenuList.ts'
import { modalTheme } from './shared/themes/Modal.ts'
import { radioTheme } from './shared/themes/Radio.ts'
import { selectTheme } from './shared/themes/Select.ts'
import { switchTheme } from './shared/themes/Switch.ts'

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  components: {
    Checkbox: checkboxTheme,
    Menu: menuTheme,
    Modal: modalTheme,
    Switch: switchTheme,
    Select: selectTheme,
    Radio: radioTheme,
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
      100: '#c5c6d4',
    },
    mint: {
      700: '#047777',
      500: '#10b7b7',
      400: '#36d3d3',
      100: '#d1fafa',
    },
    cherry: {
      500: '#ef4382',
      400: '#f872a3',
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: 'brand.1000',
        color: 'whiteAlpha.900',
        transition: 'background-color 0.2s ease',
      },
    }),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min — no refetch on tab switch / component remount
      gcTime: 10 * 60 * 1000,     // 10 min — keep in memory after unmount
      retry: 1,
    },
  },
})

async function main() {
  const rootElement = document.getElementById('root')

  if (!rootElement) return

  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

main()
