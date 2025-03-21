import styles from './AccountingItem.module.scss'

interface AccountingItemProps {
  title: string
  value: string | number
  color?: string
}

export const AccountingItem = ({
  title,
  value,
  color,
}: AccountingItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={`${styles.value} ${color}`}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
