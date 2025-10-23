import { Fragment } from 'react/jsx-runtime'

import { Item } from './Item/Item'
import styles from './RecentProducts.module.scss'
import { ClientMyOrdersItemsData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentProductsProps {
  items: ClientMyOrdersItemsData[]
}

export const RecentProducts = ({ items }: RecentProductsProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Item' style={styles.itemColumn} />
        <Title title='Price' style={styles.priceColumn} />
        <Title title='Quantity' style={styles.quantityColumn} />
        <Title title='Total' style={styles.totalColumn} />
      </div>
      <div className={styles.items}>
        {items.map((item, index) => {
          return (
            <Fragment key={index}>
              <Item data={item} />
              {index !== items.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
