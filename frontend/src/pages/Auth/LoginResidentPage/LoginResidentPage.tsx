import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { SignInForm } from '../../../features/Auth/SignInForm/SignInForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './LoginResidentPage.module.scss'

export const LoginResidentPage = () => {
  const navigate = useNavigate()

  const handleNavigateSignIn = () => {
    navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
  }

  useEffect(() => {
    document.title = 'infiniti | Login'
  }, [])

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.goBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Go back to Sign in'
        onClick={handleNavigateSignIn}
      />
      <AuthForm title='Login as a resident'>
        <SignInForm resident />
      </AuthForm>
    </div>
  )
}
