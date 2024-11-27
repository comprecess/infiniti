import React, { FC } from 'react'

import { ClientInvoiceData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

interface RecentInvoicesProps {
  invoices: ClientInvoiceData[]
}

export const RecentInvoices: FC<RecentInvoicesProps> = ({ invoices }) => {
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
            <React.Fragment key={'order.id'}>
              <Item
                hashtag={invoice.code}
                amount={invoice.amount}
                invoiceDate={invoice.invoiceDate}
                dueDate={invoice.dueDate}
                status={invoice.status}
              />
              {index !== invoices.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
