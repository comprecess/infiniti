import { FC } from 'react'

import styles from './InfoItem.module.scss'

interface InfoItemProps {
  title: string
  value: string
}

export const InfoItem: FC<InfoItemProps> = ({ title, value }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.value} contentEditable={false}>
        {value ? value : '-'}
      </span>
    </div>
  )
}
