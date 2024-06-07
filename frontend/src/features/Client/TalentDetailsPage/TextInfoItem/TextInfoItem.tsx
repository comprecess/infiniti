import { FC } from 'react'

import styles from './TextInfoItem.module.scss'

interface InfoItemProps {
  title: string
  text: string
}

export const TextInfoItem: FC<InfoItemProps> = ({ title, text }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.text}>{text}</span>
    </div>
  )
}
