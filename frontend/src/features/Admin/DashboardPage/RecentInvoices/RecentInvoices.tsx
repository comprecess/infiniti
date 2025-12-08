import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Chart } from './Chart/Chart'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'
import {
  DashboardInvoicesStatusesData,
  DashboardRecentInvoicesData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentInvoicesProps {
  invoices: DashboardRecentInvoicesData[]
  statuses: DashboardInvoicesStatusesData
  roles?: { [key: string]: RolesAccess }
}

export const RecentInvoices = ({ invoices, statuses, roles }: RecentInvoicesProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.chart}>
          <div className={styles.columns}>
            <Title title='#' style={styles.hashtagColumn} />
            <Title title={t('admin-dashboard-page-card-4-table-1')} style={styles.accountColumn} />
            <Title title={t('admin-dashboard-page-card-4-table-2')} style={styles.amountColumn} />
            <Title title={t('admin-dashboard-page-card-4-table-3')} style={styles.createdColumn} />
            <Title title={t('admin-dashboard-page-card-4-table-4')} style={styles.dueColumn} />
            <Title title={t('admin-dashboard-page-card-4-table-5')} style={styles.statusColumn} />
          </div>
          <div className={styles.items}>
            {invoices.map((invoice, index) => {
              return (
                <Fragment key={invoice.id}>
                  <Item
                    invoiceId={invoice.id}
                    clientId={invoice.account.id}
                    hashtag={invoice.code}
                    account={invoice.account.account}
                    amount={invoice.amount}
                    created={invoice.invoiceDate}
                    due={invoice.dueDate}
                    status={invoice.status}
                    roles={roles}
                  />
                  {index !== invoices.length - 1 && <CustomDivider />}
                </Fragment>
              )
            })}
          </div>
        </div>
        <Chart data={invoices.map(item => item.status)} statuses={statuses} />
      </div>
    </div>
  )
}
