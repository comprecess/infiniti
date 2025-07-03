import { useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { authTokenString } from './app/constants/constants'
import { router } from './app/router/router'
import { initOneSignal } from './oneSignalService'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/GetProfileInfo'
import { getSession } from './shared/utils/Saving/Session/GetSession'

export const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState(false)

  const { setColorMode } = useColorMode()

  const sessionToken = getSession(authTokenString)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent,
        )

      const hasTouch =
        'ontouchstart' in window || navigator.maxTouchPoints > 0

      const isSmallScreen = window.innerWidth <= 768
      const isPortrait = window.matchMedia(
        '(orientation: portrait)',
      ).matches

      const mobileCheck =
        isMobileUserAgent && hasTouch && isSmallScreen && isPortrait

      setIsMobile(mobileCheck)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      if (isMobile && !sessionToken) await initOneSignal()

      await getProfileInfo()

      setIsLoading(false)
      setColorMode('dark')
    }
    init()

    setTimeout(() => setShowLoadingScreen(false), 2000)
  }, [isMobile])

  if (isLoading || showLoadingScreen) {
    return <LoadingScreen />
  }

  return <RouterProvider router={router} />
}
