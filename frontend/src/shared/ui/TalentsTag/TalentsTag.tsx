import styles from './TalentsTag.module.scss'

interface TalentsTagProps {
  title: string
  maxWidth?: string
}

export const TalentsTag = ({ title, maxWidth }: TalentsTagProps) => {
  return (
    <div className={styles.wrapper} style={{ maxWidth }}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
