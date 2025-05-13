import { useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router'
import { initOneSignal } from './oneSignalService'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/GetProfileInfo'

export const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true)

  const { setColorMode } = useColorMode()

  useEffect(() => {
    const init = async () => {
      await initOneSignal()
      await getProfileInfo()
      setIsLoading(false)
      setColorMode('dark')
    }
    init()

    setTimeout(() => setShowLoadingScreen(false), 2000)
  }, [])

  if (isLoading || showLoadingScreen) {
    return <LoadingScreen />
  }

  return <RouterProvider router={router} />
}
