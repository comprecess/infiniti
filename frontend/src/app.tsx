import { useColorMode } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/GetProfileInfo'

export const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)

  const { setColorMode } = useColorMode()

  useEffect(() => {
    const loadProfileInfo = async () => {
      await getProfileInfo()

      setIsLoading(false)
      setColorMode('light')
    }

    loadProfileInfo()

    setTimeout(() => {
      setShowLoadingScreen(false)
    }, 1500)
  }, [])

  if (isLoading || showLoadingScreen) {
    return <LoadingScreen />
  }

  return <RouterProvider router={router} />
}
