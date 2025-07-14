import { useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { authTokenString } from './app/constants/constants'
import { router } from './app/router/router'
import { initOneSignal } from './oneSignalService'
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen'
import { getProfileInfo } from './shared/utils/api/GetProfileInfo'
import { useDeviceDetect } from './shared/utils/hooks/useDeviceDetect'
import { getSession } from './shared/utils/Saving/Session/GetSession'

export const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true)

  const { setColorMode } = useColorMode()
  const { isMobile } = useDeviceDetect()

  const sessionToken = getSession(authTokenString)

  useEffect(() => {
    const init = async () => {
      if (isMobile === true && !sessionToken) await initOneSignal()

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
