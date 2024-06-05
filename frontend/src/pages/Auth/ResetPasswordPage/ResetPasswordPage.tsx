import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ResetPasswordForm } from '../../../features/Auth/ResetPasswordForm/ResetPasswordForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './ResetPasswordPage.module.scss'

export const ResetPasswordPage: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'infiniti | Reset Password'
  }, [])

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.goBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Cancel'
        onClick={() => navigate('/auth/signin')}
      />
      <AuthForm title='Reset password'>
        <ResetPasswordForm />
      </AuthForm>
    </div>
  )
}
