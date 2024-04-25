import { FC } from 'react'

import styles from './Notification.module.scss'

interface NotificationProps {
  count: number
}

export const Notification: FC<NotificationProps> = ({ count }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.text}>{count < 10 ? count : '9+'}</span>
    </div>
  )
}
