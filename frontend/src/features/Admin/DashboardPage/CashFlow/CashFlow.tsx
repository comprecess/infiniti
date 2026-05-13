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

  if (!data) return null

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
            amount={String(data.client ?? 0)}
            onClick={navigateToListCustomers}
          />
          <BigCard
            title={t('admin-dashboard-page-info-card-2-title')}
            icon='/icons/elements.svg'
            amount={String(data.company ?? 0)}
            onClick={navigateToListCompanies}
          />
          <BigCard
            title={t('admin-dashboard-page-info-card-3-title')}
            icon='/icons/userPlusPurple.svg'
            amount={String(data.leads ?? 0)}
            onClick={navigateToLeads}
          />
        </div>
        <div className={styles.chart}>
          <NetWorth
            amount={String(data.newWorth ?? 0)}
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
          income={String(data.Income?.today ?? 0)}
          expense={String(data.Expense?.today ?? 0)}
        />
        <CustomDivider />
        <MiniCard
          title={t('admin-dashboard-page-mini-info-card-2-title')}
          income={String(data.Income?.thisMonth ?? 0)}
          expense={String(data.Expense?.thisMonth ?? 0)}
        />
        <CustomDivider />
        <MiniCard
          title={t('admin-dashboard-page-mini-info-card-3-title')}
          income={String(data.Income?.total ?? 0)}
          expense={String(data.Expense?.total ?? 0)}
        />
      </div>
    </div>
  )
}
