import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Routes } from '../../../app/router/routes'
import { ResetPasswordForm } from '../../../features/Auth/ResetPasswordForm/ResetPasswordForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import { AuthForm } from '../AuthForm/AuthForm'
import styles from './ResetPasswordPage.module.scss'

export const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const handleNavigateSignIn = () => {
    navigate(`/${Routes.auth}/${Routes.sign}/${Routes.in}`)
  }

  useEffect(() => {
    document.title = 'infiniti | Reset Password'
  }, [])

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.goBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Cancel'
        onClick={handleNavigateSignIn}
      />
      <AuthForm title='Reset password'>
        <ResetPasswordForm />
      </AuthForm>
    </div>
  )
}
