import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './GoogleAuthPage.module.scss'
import { authTokenString } from '../../../app/constants/constants'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { saveCookies } from '../../../shared/utils/Saving/Cookies/SaveCookies'
import { useTextFromUrl } from '../../../shared/utils/usefulMethods'

export const GoogleAuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const token = useTextFromUrl('auth')

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const toastShown = useRef(false)

  const checkToken = () => {
    if (token) {
      saveCookies(authTokenString, token, 30)
      navigate('/')
    } else {
      const message = searchParams.get('message')

      if (message && !toastShown.current) {
        toastShown.current = true
        showToast({
          title: 'Error',
          description: message,
          status: 'error',
        })

        searchParams.delete('message')

        setSearchParams(searchParams, { replace: true })
      }

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
