import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BigCard } from './BigCard/BigCard'
import styles from './CashFlow.module.scss'
import { NetWorth } from './Chart/NetWorth/NetWorth'
import { MiniCard } from './MiniCard/MiniCard'
import { DashboardData, RolesAccess } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { BarChart } from '../../../../shared/ui/DashboardChart/BarChart'

interface CashFlowProps {
  data: DashboardData
  roles?: { [key: string]: RolesAccess }
}

export const CashFlow = ({ data, roles }: CashFlowProps) => {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const navigateToListCustomers = () => {
    if (roles && roles.customers.view === 0) {
      navigate(`/403`)
    } else {
      navigate(`/${Routes.adminPages}/${Routes.customers}/${Routes.list}/${Routes.customer}`)
    }
  }

  const navigateToListCompanies = () => {
    if (roles && roles.companies.view === 0) {
      navigate(`/403`)
    } else {
      navigate(`/${Routes.adminPages}/${Routes.customers}/${Routes.companies}`)
    }
  }

  const navigateToLeads = () => {
    if (roles && roles.leads.view === 0) {
      navigate(`/403`)
    } else {
      navigate(`/${Routes.adminPages}/${Routes.leads}`)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftItem}>
        <div className={styles.cardsInfo}>
          <BigCard
            title={t('admin-dashboard-page-info-card-1-title')}
            icon='/icons/user.svg'
            amount={data.client.toString()}
            onClick={navigateToListCustomers}
          />
          <BigCard
            title={t('admin-dashboard-page-info-card-2-title')}
            icon='/icons/elements.svg'
            amount={data.company.toString()}
            onClick={navigateToListCompanies}
          />
          <BigCard
            title={t('admin-dashboard-page-info-card-3-title')}
            icon='/icons/userPlusPurple.svg'
            amount={data.leads.toString()}
            onClick={navigateToLeads}
          />
        </div>
        <div className={styles.chart}>
          <NetWorth
            amount={data.newWorth}
            firstTitle='admin-dashboard-page-chart-legend-1'
            secondTitle='admin-dashboard-page-chart-legend-2'
          />
          <BarChart
            data={data.graph}
            namesKeys={[
              'admin-dashboard-page-bar-chart-legend-1',
              'admin-dashboard-page-bar-chart-legend-2',
            ]}
          />
        </div>
      </div>
      <div className={styles.rightItem}>
        <MiniCard
          title={t('admin-dashboard-page-mini-info-card-1-title')}
          income={data.Income.today.toString()}
          expense={data.Expense.today.toString()}
        />
        <CustomDivider />
        <MiniCard
          title={t('admin-dashboard-page-mini-info-card-2-title')}
          income={data.Income.thisMonth.toString()}
          expense={data.Expense.thisMonth.toString()}
        />
        <CustomDivider />
        <MiniCard
          title={t('admin-dashboard-page-mini-info-card-3-title')}
          income={data.Income.total.toString()}
          expense={data.Expense.total.toString()}
        />
      </div>
    </div>
  )
}
