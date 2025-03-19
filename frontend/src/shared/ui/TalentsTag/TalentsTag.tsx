import { FC } from 'react'

import styles from './TalentsTag.module.scss'

interface TalentsTagProps {
  title: string
  maxWidth?: string
}

export const TalentsTag: FC<TalentsTagProps> = ({ title, maxWidth }) => {
  return (
    <div className={styles.wrapper} style={{ maxWidth }}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
