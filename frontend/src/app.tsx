import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/router'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/Profile/GetProfileInfo'

const isPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  )
}

export const App = () => {
  const [isLoading, setIsLoading] = useState(isPWA())

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
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <RouterProvider router={router} />
}
