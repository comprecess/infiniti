import { FC, PropsWithChildren } from 'react'

import styles from './RecentCard.module.scss'

interface RecentCardProps {
  title: string
  style?: string
}

export const RecentCard: FC<PropsWithChildren<RecentCardProps>> = ({
  title,
  style,
  children,
}) => {
  return (
    <div className={`${styles.wrapper} ${style}`}>
      <h6 className={styles.title}>{title}</h6>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
