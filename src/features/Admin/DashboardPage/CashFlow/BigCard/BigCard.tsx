import { FC } from 'react'

import styles from './BigCard.module.scss'

interface BigCardProps {
  title: string
}

export const BigCard: FC<BigCardProps> = ({ title }) => {
  return <div className={styles.wrapper}>{title}</div>
}
