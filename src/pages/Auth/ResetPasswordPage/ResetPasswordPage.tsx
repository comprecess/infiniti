import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { ResetPasswordForm } from '../../../features/Auth/ResetPasswordForm/ResetPasswordForm'
import { IconText } from '../../../shared/ui/IconText/IconText'
import styles from './ResetPasswordPage.module.scss'

export const ResetPasswordPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <IconText
        styleText={styles.stackGoBackText}
        icon='/icons/chevronLeftGray.svg'
        text='Cancel'
        onClick={() => navigate('/auth/signin')}
      />
      <h2 className={styles.title}>Reset password</h2>
      <ResetPasswordForm />
    </div>
  )
}
