import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { RegisterForm } from '../../../features/Auth/RegisterForm/RegisterForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './RegisterPage.module.scss'

export const RegisterPage = () => {
  const navigate = useNavigate()

  const handleNavigateSignIn = () => {
    navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
  }

  useEffect(() => {
    document.title = 'infiniti | Register'
  }, [])

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.goBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Go back to Sign in'
        onClick={handleNavigateSignIn}
      />
      <AuthForm title='Register'>
        <RegisterForm />
        <IconText
          styleText={styles.alreadyRegisteredText}
          icon='/icons/logInBlue.svg'
          text='Already registered? Sign in'
          onClick={handleNavigateSignIn}
        />
      </AuthForm>
    </div>
  )
}
