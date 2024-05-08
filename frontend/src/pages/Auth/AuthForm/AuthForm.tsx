import { FC, PropsWithChildren } from 'react'

import styles from './AuthForm.module.scss'

interface AuthFormProps {
  title: string
}

export const AuthForm: FC<PropsWithChildren<AuthFormProps>> = ({
  title,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  )
}
