import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { SignInForm } from '../../../features/Auth/SignInForm/SignInForm'
import { CustomDivider } from '../../../shared/ui/CustomDivider/CustomDivider'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './SignInPage.module.scss'

export const SignInPage: FC = () => {
  const navigate = useNavigate()

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
          onClick={() => navigate('/auth/register')}
        />
        <CustomDivider color='#c5c6d4' />
        <IconText
          styleIcon={styles.loginIconPerson}
          styleText={styles.loginText}
          icon='/icons/logInGray.svg'
          text='Login as a resident'
          onClick={() => navigate('/auth/loginresident')}
        />
      </div>
    </AuthForm>
  )
}
