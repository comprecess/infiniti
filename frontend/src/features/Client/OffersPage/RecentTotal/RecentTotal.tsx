import React, { FC } from 'react'

import { RecentOffersTotalData } from '../../../../app/data/client/recentOffersTotal'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTotal.module.scss'

export const RecentTotal: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Subject' style={styles.subjectColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Date Created' style={styles.dateCreatedColumn} />
        <Title title='Expiry Date' style={styles.expiryDateColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {RecentOffersTotalData.map((order, index) => {
          return (
            <React.Fragment key={order.id}>
              <Item
                subject={order.subject}
                amount={order.amount}
                dateCreated={order.dateCreated}
                expiryDate={order.expiryDate}
              />
              {index !== RecentOffersTotalData.length - 1 && (
                <CustomDivider />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
