import { FC } from 'react'

import styles from './InfoItem.module.scss'

interface InfoItemProps {
  title: string
  description: string
}

export const InfoItem: FC<InfoItemProps> = ({ title, description }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </div>
  )
}
