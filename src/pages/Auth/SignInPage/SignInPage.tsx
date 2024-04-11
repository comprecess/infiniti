import { Divider } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { SignInForm } from '../../../features/Auth/SignInForm/SignInForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './SignInPage.module.scss'

export const SignInPage: FC = () => {
  const navigate = useNavigate()

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
        <Divider />
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
