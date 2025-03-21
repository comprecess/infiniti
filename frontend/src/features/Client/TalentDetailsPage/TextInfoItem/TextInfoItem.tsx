import styles from './TextInfoItem.module.scss'

interface InfoItemProps {
  title: string
  text: string
}

export const TextInfoItem = ({ title, text }: InfoItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.text}>{text}</span>
    </div>
  )
}
