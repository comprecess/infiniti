import { FC } from 'react'

import styles from './Item.module.scss'

interface ItemProps {
  label: string
  percentage: number
  colorPercentage: string
}

export const Item: FC<ItemProps> = ({ label, percentage, colorPercentage }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.percentage} ${colorPercentage}`}>
        {percentage}
        %
      </span>
    </div>
  )
}
