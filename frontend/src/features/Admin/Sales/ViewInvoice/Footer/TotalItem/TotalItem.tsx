import styles from './TotalItem.module.scss'

interface TotalItemProps {
  title: string
  value: string
}

export const TotalItem = ({ title, value }: TotalItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{`${title}:`}</span>
      <span className={styles.value} contentEditable={false}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
