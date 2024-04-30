import { Divider } from '@mui/material'
import React, { FC } from 'react'

import { RecentInvoicesData } from '../../../../app/data/client/recentInvoices'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

export const RecentInvoices: FC = () => {
  return (
    <div className={styles.wrapper}>
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
        {RecentInvoicesData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                hashtag={order.hashtag}
                account={order.account}
                amount={order.amount}
                invoiceDate={order.invoiceDate}
                dueDate={order.dueDate}
                status={order.status}
              />
              {index !== RecentInvoicesData.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
