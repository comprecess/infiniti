import { FC } from 'react'

import styles from './TalentsTag.module.scss'

interface TalentsTagProps {
  title: string
}

export const TalentsTag: FC<TalentsTagProps> = ({ title }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
