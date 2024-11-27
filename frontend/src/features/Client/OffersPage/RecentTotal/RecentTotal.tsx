import React, { FC } from 'react'

import { ClientOfferData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTotal.module.scss'

interface RecentTotalProps {
  offers: ClientOfferData[]
}

export const RecentTotal: FC<RecentTotalProps> = ({ offers }) => {
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
        {offers.map((offer, index) => {
          return (
            <React.Fragment key={'order.id'}>
              <Item
                subject={offer.subject}
                amount={offer.total}
                dateCreated={offer.dateCreated}
                expiryDate={offer.validUntil}
              />
              {index !== offers.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
