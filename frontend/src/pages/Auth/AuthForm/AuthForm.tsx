import { PropsWithChildren } from 'react'

import styles from './AuthForm.module.scss'

interface AuthFormProps {
  title: string
}

export const AuthForm = ({
  title,
  children,
}: PropsWithChildren<AuthFormProps>) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  )
}
