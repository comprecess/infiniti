import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { SignInForm } from '../../../features/Auth/SignInForm/SignInForm'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './SignInPage.module.scss'

export const SignInPage: FC = () => {
  const navigate = useNavigate()

  const handleNavigateRegister = () => {
    navigate(`/${Routes.auth}/${Routes.register}`)
  }

  const handleNavigateLoginResident = () => {
    navigate(`/${Routes.auth}/${Routes.login}/${Routes.resident}`)
  }

  useEffect(() => {
    document.title = 'infiniti | Sign In'
  }, [])

  return (
    <AuthForm title='Sign in'>
      <SignInForm resident={false} />
      <div className={styles.items}>
        <IconText
          styleIcon={styles.userIconPerson}
          styleText={styles.userText}
          icon='/icons/userPlusBlue.svg'
          text='Startup? Register'
          onClick={handleNavigateRegister}
        />
        <CustomDivider color='#c5c6d4' />
        <IconText
          styleIcon={styles.loginIconPerson}
          styleText={styles.loginText}
          icon='/icons/logInGray.svg'
          text='Login as a resident'
          onClick={handleNavigateLoginResident}
        />
      </div>
    </AuthForm>
  )
}
