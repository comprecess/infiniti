import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'
import { ClientInvoiceData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentInvoicesProps {
  invoices: ClientInvoiceData[]
}

export const RecentInvoices = ({ invoices }: RecentInvoicesProps) => {
  if (invoices.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.hashtagColumn} />
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
              <Item {...invoice} />
              {index !== invoices.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
