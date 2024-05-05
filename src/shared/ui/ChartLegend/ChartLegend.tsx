import { FC } from 'react'

import styles from './ChartLegend.module.scss'

interface ChartLegendProps {
  title: string
  color: string
}

export const ChartLegend: FC<ChartLegendProps> = ({ title, color }) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.cube} ${color}`} />
      <span className={styles.title}>{title}</span>
    </div>
  )
}
