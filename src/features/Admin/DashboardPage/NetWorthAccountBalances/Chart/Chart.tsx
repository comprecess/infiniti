import { FC } from 'react'

import styles from './Chart.module.scss'

interface ChartProps {
  amount: string
  total: string
}

export const Chart: FC<ChartProps> = ({ amount, total }) => {
  const amountValue = parseFloat(amount.replace(/[$,]/g, ''))
  const totalValue = parseFloat(total.replace(/[$,]/g, ''))

  const percentage = (amountValue / totalValue) * 100

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        <span className={styles.amount}>{amount}</span>
        <span className={styles.syllable}>of</span>
        <span className={styles.total}>{total}</span>
      </div>
      <div className={styles.segments}>
        <div className={styles.backgroundSegment}>
          <div
            className={styles.segment}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
