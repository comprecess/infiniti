import { Fragment } from 'react'

import { ClientOfferData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'

interface RecentOffersProps {
  offers: ClientOfferData[]
}

export const RecentOffers = ({ offers }: RecentOffersProps) => {
  return (
    <div className={styles.wrapper}>
      {offers.length > 0 ? (
        <>
          <div className={styles.columns}>
            <Title title='Subject' style={styles.subjectColumn} />
            <Title title='Amount' style={styles.amountColumn} />
            <Title title='Date created' style={styles.dateCreatedColumn} />
            <Title title='Expiry date' style={styles.expiryDateColumn} />
            <Title title='Manage' style={styles.manageColumn} />
          </div>
          <div className={styles.items}>
            {offers.map((offer, index) => {
              return (
                <Fragment key={offer.id}>
                  <Item
                    subject={offer.subject}
                    amount={offer.total}
                    dateCreated={offer.dateCreated}
                    expiryDate={offer.validUntil}
                    publicCode={offer.public}
                  />
                  {index !== offers.length - 1 && <CustomDivider />}
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
