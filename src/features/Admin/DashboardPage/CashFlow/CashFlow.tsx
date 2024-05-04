import { Divider } from '@mui/material'
import { FC } from 'react'

import { IncomeExpenseData } from '../../../../app/data/admin/cashFlow'
import { BigCard } from './BigCard/BigCard'
import styles from './CashFlow.module.scss'
import { MiniCard } from './MiniCard/MiniCard'

export const CashFlow: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftItem}>
        <div className={styles.cardsInfo}>
          <BigCard title='Customers' />
          <BigCard title='Companies' />
          <BigCard title='Leads' />
        </div>
        <div className={styles.chart}>Chart</div>
      </div>
      <div className={styles.rightItem}>
        <MiniCard
          title='Today'
          income={IncomeExpenseData.today.income}
          expense={IncomeExpenseData.today.expense}
        />
        <Divider className={styles.divider} />
        <MiniCard
          title='Last Month'
          income={IncomeExpenseData.lastMonth.income}
          expense={IncomeExpenseData.lastMonth.expense}
        />
        <Divider className={styles.divider} />
        <MiniCard
          title='Total'
          income={IncomeExpenseData.total.income}
          expense={IncomeExpenseData.total.expense}
        />
      </div>
    </div>
  )
}
