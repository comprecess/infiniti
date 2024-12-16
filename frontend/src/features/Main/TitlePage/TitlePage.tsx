import { FC } from 'react'

import styles from './TitlePage.module.scss'

interface TitlePageProps {
  title: string
  secondTitle?: string
}

export const TitlePage: FC<TitlePageProps> = ({ title, secondTitle }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      {secondTitle && (
        <h3 className={styles.secondTitle}>{secondTitle}</h3>
      )}
    </div>
  )
}
