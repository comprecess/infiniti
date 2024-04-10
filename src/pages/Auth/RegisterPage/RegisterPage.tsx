import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { RegisterForm } from '../../../features/Auth/RegisterForm/RegisterForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './RegisterPage.module.scss'

export const RegisterPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.goBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Go back to Sign in'
        onClick={() => navigate('/auth/signin')}
      />
      <AuthForm title='Register'>
        <RegisterForm />
        <IconText
          styleText={styles.alreadyRegisteredText}
          icon='/icons/logInBlue.svg'
          text='Already registered? Sign in'
          onClick={() => navigate('/auth/signin')}
        />
      </AuthForm>
    </div>
  )
}
