import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './GoogleAuthPage.module.scss'
import { authTokenString } from '../../../app/constants/constants'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { saveCookies } from '../../../shared/utils/Saving/Cookies/SaveCookies'
import { useTextFromUrl } from '../../../shared/utils/usefulMethods'

export const GoogleAuthPage = () => {
  const token = useTextFromUrl('auth')

  const navigate = useNavigate()

  const checkToken = () => {
    if (token) {
      saveCookies(authTokenString, token, 30)
      navigate('/')
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    checkToken()
  }, [token])

  useEffect(() => {
    document.title = 'Infiniti | Google Auth'
  }, [])

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Login...</span>
      <LoadingSpinner size='xl' />
    </div>
  )
}
