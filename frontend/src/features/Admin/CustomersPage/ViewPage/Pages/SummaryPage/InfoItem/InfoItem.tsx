import styles from './InfoItem.module.scss'

interface InfoItemProps {
  title: string
  value: string
}

export const InfoItem = ({ title, value }: InfoItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{`${title}:`}</span>
      <span className={styles.value} contentEditable={false}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
