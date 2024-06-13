import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/Profile/GetProfileInfo'

const isPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone ||
    document.referrer.includes('android-app://')
  )
}

export const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)

  useEffect(() => {
    const loadProfileInfo = async () => {
      await getProfileInfo()
      setIsLoading(false)
    }

    if (isPWA()) {
      loadProfileInfo()
    } else {
      setIsLoading(false)
    }

    setTimeout(() => {
      setShowLoadingScreen(false)
    }, 2000)
  }, [])

  if (isLoading && showLoadingScreen) {
    return <LoadingScreen />
  }

  return <RouterProvider router={router} />
}
