import styles from './StatusProfitability.module.scss'
import { LightningIcon } from '../../icons/LightningIcon'

interface StatusProfitabilityProps {
  profitability: string
}

const profitabilityColors = {
  average: styles.average,
  high: styles.high,
  veryHigh: styles.veryHigh,
}

export const StatusProfitability = ({
  profitability,
}: StatusProfitabilityProps) => {
  let style = ''

  switch (profitability) {
    case 'Average':
      style = profitabilityColors.average
      break
    case 'High':
      style = profitabilityColors.high
      break
    case 'Very high':
      style = profitabilityColors.veryHigh
      break
  }

  return (
    <div className={`${styles.wrapper} ${style}`}>
      <LightningIcon style={styles.icon} />
      {profitability === 'Average' && (
        <span className={styles.title}>Average</span>
      )}
      {profitability === 'High' && (
        <span className={styles.title}>High</span>
      )}
      {profitability === 'Very high' && (
        <span className={styles.title}>Very High</span>
      )}
    </div>
  )
}
