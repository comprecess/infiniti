import styles from './TitleCard.module.scss'

interface TitleCardProps {
  title: string
  secondTitle?: string
}

export const TitleCard = ({ title, secondTitle }: TitleCardProps) => {
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>{title}</h4>
      {secondTitle && (
        <h4 className={styles.secondTitle}>{secondTitle}</h4>
      )}
    </div>
  )
}
