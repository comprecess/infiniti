import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/Profile/GetProfileInfo'

export const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)

  useEffect(() => {
    const loadProfileInfo = async () => {
      await getProfileInfo()

      setIsLoading(false)
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
