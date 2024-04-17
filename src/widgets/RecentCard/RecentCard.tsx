import { FC, PropsWithChildren } from 'react'

import styles from './RecentCard.module.scss'

interface RecentCardProps {
  title: string
}

export const RecentCard: FC<PropsWithChildren<RecentCardProps>> = ({
  title,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>{title}</h6>
      {children}
    </div>
  )
}
