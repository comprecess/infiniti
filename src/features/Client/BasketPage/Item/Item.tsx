import { FC } from 'react'

import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import styleItem from '../../../../widgets/BasketCart/Cart/Cart.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  avatar: string
  nameEmail: string
  profession: string
  quantity: string
  taxes: string
  taxesAmount: string
  amount: string
  onDelete: () => void
}

export const Item: FC<ItemProps> = ({
  avatar,
  nameEmail,
  profession,
  quantity,
  taxes,
  taxesAmount,
  amount,
  onDelete,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styleItem.avatarColumn}>
        <img src={avatar} alt='Avatar' />
      </div>
      <div
        className={`${styleItem.nameEmailColumn} ${styles.itemsColumn}`}
      >
        <span className={styles.nameEmailItem}>{nameEmail}</span>
        <span className={styles.professionItem}>{profession}</span>
      </div>
      <span
        className={`${styleItem.quantityColumn} ${styles.quantityItem}`}
      >
        {quantity}
      </span>
      <div className={`${styleItem.taxesColumn} ${styles.itemsRow}`}>
        {taxes === 'Included' ? (
          <img src='/icons/info.svg' alt='Info' />
        ) : null}
        <span className={styles.taxesItem}>{taxes}</span>
      </div>
      <div className={`${styleItem.amountColumn} ${styles.itemsColumn}`}>
        <span className={styles.amountItem}>{amount}</span>
        <span className={styles.taxesAmountItem}>{taxesAmount}</span>
      </div>
      <div className={styleItem.crossColumn}>
        <div className={styles.crossItem} onClick={onDelete}>
          <CrossIcon />
        </div>
      </div>
    </div>
  )
}
