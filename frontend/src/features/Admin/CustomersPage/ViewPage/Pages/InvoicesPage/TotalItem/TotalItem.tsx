import styles from './TotalItem.module.scss'

interface TotalItemProps {
  title: string
  value: string | number
  color?: string
}

export const TotalItem = ({ title, value, color }: TotalItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={`${styles.value} ${color}`}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
