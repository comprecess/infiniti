import styles from './Notification.module.scss'

interface NotificationProps {
  count: number | undefined
}

export const Notification = ({ count }: NotificationProps) => {
  return count ? (
    <div className={styles.wrapper}>
      <div className={styles.wrapperText}>
        <span className={styles.text}>{count < 10 ? count : '9+'}</span>
      </div>
    </div>
  ) : null
}
