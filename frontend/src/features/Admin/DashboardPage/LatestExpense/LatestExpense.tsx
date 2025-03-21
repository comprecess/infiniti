import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { DashboardLatestIncomeExpenseData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './LatestExpense.module.scss'

interface LatestExpenseProps {
  latestExpense: DashboardLatestIncomeExpenseData[]
}

export const LatestExpense = ({ latestExpense }: LatestExpenseProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          title={t('admin-dashboard-page-card-7-table-1')}
          style={styles.dateColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-7-table-2')}
          style={styles.descriptionColumn}
        />
        <Title
          title={t('admin-dashboard-page-card-7-table-3')}
          style={styles.amountColumn}
        />
      </div>
      <div className={styles.items}>
        {latestExpense.map((expense, index) => {
          return (
            <Fragment key={index}>
              <Item
                date={expense.date}
                amount={expense.amount}
                description={expense.description}
              />
              {index !== latestExpense.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
