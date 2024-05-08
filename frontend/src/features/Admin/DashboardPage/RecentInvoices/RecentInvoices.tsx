import { Divider } from '@mui/material'
import React, { FC } from 'react'

import { RecentInvoicesData } from '../../../../app/data/admin/recentInvoices'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Chart } from './Chart/Chart'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

export const RecentInvoices: FC = () => {
  const data: string[] = RecentInvoicesData.map(item => item.status)

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div>
          <div className={styles.columns}>
            <Title title='#' style={styles.hashtagColumn} />
            <Title title='Account' style={styles.accountColumn} />
            <Title title='Amount' style={styles.amountColumn} />
            <Title title='Created' style={styles.createdColumn} />
            <Title title='Due' style={styles.dueColumn} />
            <Title title='Status' style={styles.statusColumn} />
          </div>
          <div className={styles.items}>
            {RecentInvoicesData.map((order, index) => {
              return (
                <React.Fragment key={order.id}>
                  <Item
                    hashtag={order.hashtag}
                    account={order.account}
                    amount={order.amount}
                    created={order.created}
                    due={order.due}
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
        <Chart data={data} />
      </div>
    </div>
  )
}
