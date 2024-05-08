import { FC } from 'react'

import styles from './Chart.module.scss'
import { Item } from './Item/Item'

interface ChartProps {
  data: string[]
}

export const Chart: FC<ChartProps> = ({ data }) => {
  const totalCount = data.length
  const counts: { [key: string]: number } = {}

  data.forEach(item => {
    counts[item] = (counts[item] || 0) + 1
  })

  const chartData = Object.keys(counts).map(key => ({
    label: key,
    count: counts[key],
    percentage: Math.round((counts[key] / totalCount) * 100),
  }))

  const getColorText = (label: string): string => {
    const colorMap: { [key: string]: string } = {
      Unpaid: styles.unpaidText,
      'Partially paid': styles.partiallyPaidText,
      Paid: styles.paidText,
    }

    return colorMap[label] || 'white'
  }

  const getColorBG = (label: string): string => {
    const colorMap: { [key: string]: string } = {
      Unpaid: styles.unpaidBar,
      'Partially paid': styles.partiallyPaidBar,
      Paid: styles.paidBar,
    }

    return colorMap[label] || 'white'
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        {chartData.map((item, index) => (
          <Item
            key={index}
            label={item.label}
            percentage={item.percentage}
            colorPercentage={getColorText(item.label)}
          />
        ))}
      </div>
      <div className={styles.segments}>
        {chartData.map((item, index) => (
          <div
            key={index}
            className={`${styles.segment} ${getColorBG(item.label)}`}
            style={{
              width: `${item.percentage}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
