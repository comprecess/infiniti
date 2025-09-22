import styles from './Chart.module.scss'
import { Item } from './Item/Item'
import { DashboardInvoicesStatusesData } from '../../../../../app/constants/constants'

interface ChartProps {
  data: string[]
  statuses: DashboardInvoicesStatusesData
}

export const Chart = ({ data, statuses }: ChartProps) => {
  const chartData = Object.entries(statuses)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])

  const getColorText = (label: string): string => {
    const colorMap: { [key: string]: string } = {
      Unpaid: styles.unpaidText,
      'Partially Paid': styles.partiallyPaidText,
      Paid: styles.paidText,
    }

    return colorMap[label] || 'white'
  }

  const getColorBG = (label: string): string => {
    const colorMap: { [key: string]: string } = {
      Unpaid: styles.unpaidBar,
      'Partially Paid': styles.partiallyPaidBar,
      Paid: styles.paidBar,
    }

    return colorMap[label] || 'white'
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        {chartData.map(([label, percentage], index) => (
          <Item
            key={index}
            label={label}
            percentage={percentage}
            colorPercentage={getColorText(label)}
          />
        ))}
      </div>
      <div className={styles.segments}>
        {chartData.map(([label, percentage], index) => (
          <div
            key={index}
            className={`${styles.segment} ${getColorBG(label)}`}
            style={{
              width: `${percentage}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
