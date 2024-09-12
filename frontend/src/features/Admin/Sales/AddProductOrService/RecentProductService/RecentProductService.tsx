import React, { FC } from 'react'

import { SalesProductOrServiceData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './RecentProductService.module.scss'

interface RecentProductServiceProps {
  servicesList: SalesProductOrServiceData[]
}

export const RecentProductService: FC<RecentProductServiceProps> = ({
  servicesList,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.hashTagColumn} />
        <Title title='Item Code' style={styles.itemCodeColumn} />
        <Title title='Item Name' style={styles.itemNameColumn} />
        <Title title='Price' style={styles.priceColumn} />
      </div>
      <div className={styles.items}>
        {servicesList.length > 0 &&
          servicesList.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                Item
                {index !== servicesList.length - 1 && <CustomDivider />}
              </React.Fragment>
            )
          })}
      </div>
    </div>
  )
}
