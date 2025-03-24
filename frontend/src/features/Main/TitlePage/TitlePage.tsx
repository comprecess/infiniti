import styles from './TitlePage.module.scss'

interface TitlePageProps {
  title: string
  secondTitle?: string
}

export const TitlePage = ({ title, secondTitle }: TitlePageProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {secondTitle && (
        <h3 className={styles.secondTitle}>{secondTitle}</h3>
      )}
    </div>
  )
}
