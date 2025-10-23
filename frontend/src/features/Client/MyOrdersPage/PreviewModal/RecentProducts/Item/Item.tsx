import styles from './Item.module.scss'
import { ClientMyOrdersItemsData } from '../../../../../../app/constants/constants'
import styleItem from '../RecentProducts.module.scss'

interface ItemProps {
  data: ClientMyOrdersItemsData
}

export const Item = ({ data }: ItemProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.itemColumn} ${styles.itemItem}`}>{data.userCatalog.name}</span>
      <span className={`${styleItem.priceColumn} ${styles.priceItem}`}>{data.price}</span>
      <span className={`${styleItem.quantityColumn} ${styles.quantityItem}`}>{data.amount}</span>
      <span className={`${styleItem.totalColumn} ${styles.totalItem}`}>{data.total}</span>
    </div>
  )
}
