import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentTotal.module.scss'
import { ClientOfferData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentTotalProps {
  offers: ClientOfferData[]
}

export const RecentTotal = ({ offers }: RecentTotalProps) => {
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
            <Fragment key={offer.id}>
              <Item {...offer} />
              {index !== offers.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
