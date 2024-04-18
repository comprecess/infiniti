import { FC } from 'react'

import styles from './Status.module.scss'

interface StatusProps {
  title: string
  colors: string
}

export const Status: FC<StatusProps> = ({ title, colors }) => {
  return (
    <div className={`${styles.wrapper} ${colors}`}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
