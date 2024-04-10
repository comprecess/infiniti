import { Divider } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { SignInForm } from '../../../features/Auth/SignInForm/SignInForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import styles from './SignInPage.module.scss'

export const SignInPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Sign in</h2>
      <SignInForm />
      <div className={styles.stack}>
        <IconText
          styleIcon={styles.stackUserIconPerson}
          styleText={styles.stackUserText}
          icon='/icons/userPlusBlue.svg'
          text='Startup? Register'
          onClick={() => navigate('/auth/register')}
        />
        <Divider />
        <IconText
          styleIcon={styles.stackLoginIconPerson}
          styleText={styles.stackLoginText}
          icon='/icons/logInGray.svg'
          text='Login as a resident'
        />
      </div>
    </div>
  )
}
