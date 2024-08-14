import React, { FC } from 'react'

import { ViewOffersTypeData } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'

interface RecentOffersProps {
  list: ViewOffersTypeData[]
}

export const RecentOffers: FC<RecentOffersProps> = ({ list }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.codeColumn} />
        <Title title='Subject' style={styles.subjectColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Date Created' style={styles.dateCreatedColumn} />
        <Title title='Expiry Date' style={styles.dateExpiryColumn} />
        <Title title='Stage' style={styles.stageColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item item={item} />
              {index !== list.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
