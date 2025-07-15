import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { authTokenString } from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getAutoLogin } from '../../../shared/utils/api/GetAutoLogin'
import { saveSession } from '../../../shared/utils/Saving/Session/SaveSession'
import { useTextFromUrl } from '../../../shared/utils/usefulMethods'
import styles from './AutoLoginPage.module.scss'

export const AutoLoginPage = () => {
  const navigate = useNavigate()
  const token = useTextFromUrl('login')

  const sendToken = async () => {
    if (token === null) return

    const sendResponse: {
      message: string
      token: string
      status: boolean
    } = await getAutoLogin(token)

    if (sendResponse.status) {
      saveSession(authTokenString, sendResponse.token)
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
