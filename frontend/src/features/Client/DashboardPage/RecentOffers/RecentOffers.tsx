import { Fragment } from 'react'

import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'

export const RecentOffers = () => {
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
        {[].map((_order, index) => {
          return (
            <Fragment key={'order.id'}>
              <Item
                subject={'order.subject'}
                amount={'order.amount'}
                dateCreated={'order.dateCreate'}
                expiryDate={'order.expiryDate'}
              />
              {index !== [].length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
