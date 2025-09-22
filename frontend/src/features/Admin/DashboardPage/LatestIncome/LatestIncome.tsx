import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Item } from './Item/Item'
import styles from './LatestIncome.module.scss'
import { DashboardLatestIncomeExpenseData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface LatestIncomeProps {
  latestIncome: DashboardLatestIncomeExpenseData[]
}

export const LatestIncome = ({ latestIncome }: LatestIncomeProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-6-table-1')}
          style={styles.dateColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-6-table-2')}
          style={styles.descriptionColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-6-table-3')}
          style={styles.amountColumn}
        />
      </div>
      <div className={styles.items}>
        {latestIncome.map((income, index) => {
          return (
            <Fragment key={index}>
              <Item
                date={income.date}
                amount={income.amount}
                description={income.description}
              />
              {index !== latestIncome.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
