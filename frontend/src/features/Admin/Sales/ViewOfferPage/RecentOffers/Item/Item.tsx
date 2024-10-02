import { FC } from 'react'

import styleItem from '../RecentOffers.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  code: number
  description: string
  price: number
  quantity: number
  discount: number
  total: number
}

export const Item: FC<ItemProps> = ({
  code,
  description,
  price,
  quantity,
  discount,
  total,
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.codeColumn} ${styles.codeItem}`}>
        {code}
      </span>
      <span
        dangerouslySetInnerHTML={{ __html: description }}
        className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}
      />
      <span className={`${styleItem.priceColumn} ${styles.priceItem}`}>
        {price}
      </span>
      <span
        className={`${styleItem.quantityColumn} ${styles.quantityItem}`}
      >
        {quantity}
      </span>
      <span
        className={`${styleItem.discountColumn} ${styles.discountItem}`}
      >
        {discount}
      </span>
      <span className={`${styleItem.totalColumn} ${styles.totalItem}`}>
        {total}
      </span>
    </div>
  )
}
