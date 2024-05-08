import { FC } from 'react'

import { ChartLegend } from '../../../../../../shared/ui/ChartLegend/ChartLegend'
import styles from './NetWorth.module.scss'

interface NetWorthProps {
  amount: string
}

export const NetWorth: FC<NetWorthProps> = ({ amount }) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <h3 className={styles.title}>{amount}</h3>
        <span className={styles.name}>Net Worth</span>
      </div>
      <div className={styles.legends}>
        <ChartLegend title='Expenses' color={styles.expensesColor} />
        <ChartLegend title='Income' color={styles.incomeColor} />
      </div>
    </div>
  )
}
