import { Divider } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginForm } from '../../../features/Auth/LoginForm/LoginForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import styles from './LoginPage.module.scss'

export const LoginPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Sign in</h2>
      <LoginForm />
      <div className={styles.stack}>
        <IconText
          styleIcon={styles.stackUserIconPerson}
          styleText={styles.stackUserText}
          icon='/icons/userPlus.svg'
          text='Startup? Register'
          onClick={() => navigate('/auth/register')}
        />
        <Divider />
        <IconText
          styleIcon={styles.stackLoginIconPerson}
          styleText={styles.stackLoginText}
          icon='/icons/logIn.svg'
          text='Login as a resident'
        />
      </div>
    </div>
  )
}
