import { FC } from 'react'

import styles from './TitleCard.module.scss'

interface TitleCardProps {
  title: string
  secondTitle?: string
}

export const TitleCard: FC<TitleCardProps> = ({ title, secondTitle }) => {
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>{title}</h4>
      {secondTitle && (
        <h4 className={styles.secondTitle}>{secondTitle}</h4>
      )}
    </div>
  )
}
