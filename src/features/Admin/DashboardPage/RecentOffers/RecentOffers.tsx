import { Divider } from '@mui/material'
import React, { FC } from 'react'

import { RecentOffersData } from '../../../../app/data/recentOffers'
import { Title } from '../../../Dashboard/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'

export const RecentOffers: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Subject' style={styles.subjectColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Date created' style={styles.dateCreatedColumn} />
        <Title title='Expiry date' style={styles.expiryDateColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {RecentOffersData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                subject={order.subject}
                amount={order.amount}
                dateCreated={order.dateCreate}
                expiryDate={order.expiryDate}
              />
              {index !== RecentOffersData.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
