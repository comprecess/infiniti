import { FC } from 'react'

import styles from './TitleCard.module.scss'

interface TitleCardProps {
  title: string
}

export const TitleCard: FC<TitleCardProps> = ({ title }) => {
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>{title}</h4>
    </div>
  )
}
