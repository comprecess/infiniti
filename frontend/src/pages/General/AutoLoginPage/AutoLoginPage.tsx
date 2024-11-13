import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { authTokenString } from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAutoLogin } from '../../../shared/utils/api/GetAutoLogin'
import { saveCookies } from '../../../shared/utils/Saving/Cookies/SaveCookies'
import styles from './AutoLoginPage.module.scss'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/login\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const useTokenFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractTokenFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AutoLoginPage = () => {
  const navigate = useNavigate()
  const token = useTokenFromUrl()

  const sendToken = async () => {
    if (token === null) return

    const sendResponse: {
      message: string
      token: string
      status: boolean
    } = await getAutoLogin(token)

    if (sendResponse.status) {
      saveCookies(authTokenString, sendResponse.token, 30)
      navigate('/')
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    document.title = 'Infiniti | Auto Login'
  }, [])

  useEffect(() => {
    sendToken()
  }, [token])

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Login...</span>
      <LoadingSpinner size='xl' />
    </div>
  )
}
