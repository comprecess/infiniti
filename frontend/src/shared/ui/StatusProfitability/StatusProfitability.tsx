import { FC } from 'react'

import { LightningIcon } from '../../icons/LightningIcon'
import styles from './StatusProfitability.module.scss'

interface StatusProfitabilityProps {
  profitability: 'average' | 'high' | 'veryHigh'
}

const profitabilityColors = {
  average: styles.average,
  high: styles.high,
  veryHigh: styles.veryHigh,
}

export const StatusProfitability: FC<StatusProfitabilityProps> = ({
  profitability,
}) => {
  let style = ''

  switch (profitability) {
    case 'average':
      style = profitabilityColors.average
      break
    case 'high':
      style = profitabilityColors.high
      break
    case 'veryHigh':
      style = profitabilityColors.veryHigh
      break
  }

  return (
    <div className={`${styles.wrapper} ${style}`}>
      <LightningIcon style={styles.icon} />
      {profitability === 'average' && (
        <span className={styles.title}>Average</span>
      )}
      {profitability === 'high' && (
        <span className={styles.title}>High</span>
      )}
      {profitability === 'veryHigh' && (
        <span className={styles.title}>Very High</span>
      )}
    </div>
  )
}
