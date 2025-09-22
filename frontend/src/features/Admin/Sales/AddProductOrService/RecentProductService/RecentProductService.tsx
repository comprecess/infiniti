import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentProductService.module.scss'
import { SalesProductOrServiceData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

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

export const RecentProductService = ({
  servicesList,
  addEditServiceBlank,
  addNewServiceBlank,
  onCloseModalWindow,
}: RecentProductServiceProps) => {
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
              <Fragment key={item.id}>
                <Item
                  code={item.id}
                  name={item.name}
                  price={item.price}
                  addEditServiceBlank={addEditServiceBlank}
                  addNewServiceBlank={addNewServiceBlank}
                  onCloseModalWindow={onCloseModalWindow}
                />
                {index !== servicesList.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
      </div>
    </div>
  )
}
