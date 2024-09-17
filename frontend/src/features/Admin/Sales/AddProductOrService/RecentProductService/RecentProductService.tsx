import React, { FC } from 'react'

import { SalesProductOrServiceData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentProductService.module.scss'

interface RecentProductServiceProps {
  servicesList: SalesProductOrServiceData[]
  addEditServiceBlank?: (idService: string) => void
  addNewServiceBlank?: (
    idService: string,
    price: number,
    description: string,
  ) => void
  onCloseModalWindow: () => void
}

export const RecentProductService: FC<RecentProductServiceProps> = ({
  servicesList,
  addEditServiceBlank,
  addNewServiceBlank,
  onCloseModalWindow,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Item Code' style={styles.itemCodeColumn} />
        <Title title='Item Name' style={styles.itemNameColumn} />
        <Title title='Price' style={styles.priceColumn} />
      </div>
      <div className={styles.items}>
        {servicesList.length > 0 &&
          servicesList.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                <Item
                  code={item.id}
                  name={item.name}
                  price={item.price}
                  addEditServiceBlank={addEditServiceBlank}
                  addNewServiceBlank={addNewServiceBlank}
                  onCloseModalWindow={onCloseModalWindow}
                />
                {index !== servicesList.length - 1 && <CustomDivider />}
              </React.Fragment>
            )
          })}
      </div>
    </div>
  )
}
