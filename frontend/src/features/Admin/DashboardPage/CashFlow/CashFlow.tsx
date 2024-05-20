import { FC } from 'react'

import {
  IncomeExpenseData,
  TotalInfoData,
} from '../../../../app/data/admin/cashFlow'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { BigCard } from './BigCard/BigCard'
import styles from './CashFlow.module.scss'
import { NetWorth } from './Chart/NetWorth/NetWorth'
import { MiniCard } from './MiniCard/MiniCard'

export const CashFlow: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftItem}>
        <div className={styles.cardsInfo}>
          <BigCard
            title='Customers'
            icon='/icons/user.svg'
            amount={TotalInfoData.customers}
          />
          <BigCard
            title='Companies'
            icon='/icons/elements.svg'
            amount={TotalInfoData.companies}
          />
          <BigCard
            title='Leads'
            icon='/icons/userPlusPurple.svg'
            amount={TotalInfoData.leads}
          />
        </div>
        <div className={styles.chart}>
          <NetWorth amount={TotalInfoData.netWorth} />
          <div>Chart</div>
        </div>
      </div>
      <div className={styles.rightItem}>
        <MiniCard
          title='Today'
          income={IncomeExpenseData.today.income}
          expense={IncomeExpenseData.today.expense}
        />
        <CustomDivider />
        <MiniCard
          title='Last Month'
          income={IncomeExpenseData.lastMonth.income}
          expense={IncomeExpenseData.lastMonth.expense}
        />
        <CustomDivider />
        <MiniCard
          title='Total'
          income={IncomeExpenseData.total.income}
          expense={IncomeExpenseData.total.expense}
        />
      </div>
    </div>
  )
}
