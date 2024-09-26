import React, { FC } from 'react'

import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './RecentOffers.module.scss'

export const RecentOffers: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.codeColumn} />
        <Title title='Item' style={styles.itemColumn} />
        <Title title='Price' style={styles.priceColumn} />
        <Title title='Quantity' style={styles.quantityColumn} />
        <Title title='Total' style={styles.totalColumn} />
      </div>
      <div className={styles.items}>
        {[].length > 0 &&

          [].map((_item, index) => {
            return (
              <React.Fragment key={'item.id'}>
                Item
                {index !== [].length - 1 && <CustomDivider />}
              </React.Fragment>
            )
          })}
      </div>
    </div>
  )
}
