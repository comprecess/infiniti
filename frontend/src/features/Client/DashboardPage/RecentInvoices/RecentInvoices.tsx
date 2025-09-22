import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'
import { DashboardRecentInvoicesData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentInvoicesProps {
  invoices: DashboardRecentInvoicesData[]
}

export const RecentInvoices = ({ invoices }: RecentInvoicesProps) => {
  return (
    <div className={styles.wrapper}>
      {invoices.length > 0 ? (
        <>
          <div className={styles.columns}>
            <Title title='#' style={styles.hashtagColumn} />
            <Title title='Account' style={styles.accountColumn} />
            <Title title='Amount' style={styles.amountColumn} />
            <Title title='Invoice date' style={styles.invoiceDateColumn} />
            <Title title='Due date' style={styles.dueDateColumn} />
            <Title title='Status' style={styles.statusColumn} />
            <Title title='Manage' style={styles.manageColumn} />
          </div>
          <div className={styles.items}>
            {invoices.map((invoice, index) => {
              return (
                <Fragment key={invoice.id}>
                  <Item
                    hashtag={invoice.code}
                    account={invoice.account.account}
                    amount={invoice.amount}
                    invoiceDate={invoice.invoiceDate}
                    dueDate={invoice.dueDate}
                    status={invoice.status}
                    publicCode={invoice.public}
                  />
                  {index !== invoices.length - 1 && <CustomDivider />}
                </Fragment>
              )
            })}
          </div>
        </>
      ) : (
        <div className={styles.nothingFound}>
          <span className={styles.nothingFoundText}>Nothing Found</span>
        </div>
      )}
    </div>
  )
}
