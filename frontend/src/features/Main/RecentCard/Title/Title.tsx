import { FC } from 'react'

import styles from './Title.module.scss'

interface TitleProps {
  title: string
  style?: string
}

export const Title: FC<TitleProps> = ({ title, style }) => {
  return (
    <div className={`${styles.wrapper} ${style}`}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
