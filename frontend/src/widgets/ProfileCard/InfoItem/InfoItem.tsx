import styles from './InfoItem.module.scss'

interface InfoItemProps {
  title: string
  description: string
}

export const InfoItem = ({ title, description }: InfoItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </div>
  )
}
