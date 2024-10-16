import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { DashboardData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { BigCard } from './BigCard/BigCard'
import styles from './CashFlow.module.scss'
import { BarChart } from './Chart/DashboardChart/BarChart'
import { NetWorth } from './Chart/NetWorth/NetWorth'
import { MiniCard } from './MiniCard/MiniCard'

interface CashFlowProps {
  data: DashboardData
}

export const CashFlow: FC<CashFlowProps> = ({ data }) => {
  const navigate = useNavigate()

  const navigateToListCustomers = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.list}/${Routes.customer}`,
    )
  }

  const navigateToListCompanies = () => {
    navigate(`/${Routes.adminPages}/${Routes.customers}/${Routes.companies}`)
  }

  const navigateToLeads = () => {
    navigate(`/`)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftItem}>
        <div className={styles.cardsInfo}>
          <BigCard
            title='Customers'
            icon='/icons/user.svg'
            amount={data.client.toString()}
            onClick={navigateToListCustomers}
          />
          <BigCard
            title='Companies'
            icon='/icons/elements.svg'
            amount={data.company.toString()}
            onClick={navigateToListCompanies}
          />
          <BigCard
            title='Leads'
            icon='/icons/userPlusPurple.svg'
            amount={data.leads.toString()}
            onClick={navigateToLeads}
          />
        </div>
        <div className={styles.chart}>
          <NetWorth amount={data.newWorth} />
          <BarChart data={data.graph} />
        </div>
      </div>
      <div className={styles.rightItem}>
        <MiniCard
          title='Today'
          income={data.Income.today.toString()}
          expense={data.Expense.today.toString()}
        />
        <CustomDivider />
        <MiniCard
          title='Last Month'
          income={data.Income.thisMonth.toString()}
          expense={data.Expense.thisMonth.toString()}
        />
        <CustomDivider />
        <MiniCard
          title='Total'
          income={data.Income.total.toString()}
          expense={data.Expense.total.toString()}
        />
      </div>
    </div>
  )
}
