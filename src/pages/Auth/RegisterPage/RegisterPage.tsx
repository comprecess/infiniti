import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { RegisterForm } from '../../../features/Auth/RegisterForm/RegisterForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import styles from './RegisterPage.module.scss'

export const RegisterPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.stackGoBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Go back to Sign in'
        onClick={() => navigate('/auth/signin')}
      />
      <h2 className={styles.title}>Register</h2>
      <RegisterForm />
      <IconText
        styleText={styles.stackAlreadyRegisteredText}
        icon='/icons/logInBlue.svg'
        text='Already registered? Sign in'
        onClick={() => navigate('/auth/signin')}
      />
    </div>
  )
}
