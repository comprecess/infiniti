import { FC } from 'react'

import { NameIdType } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import styleItem from '../../../../widgets/BasketCart/Cart/Cart.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  amount: number
  avatar: string
  nameEmail: string
  profession: string
  nameIdType: NameIdType
  taxes: number
  taxesAmount: string
  total: string
  onDelete: () => void
}

interface FormatTimeProps {
  amount: number
  type: NameIdType
}

export const Item: FC<ItemProps> = ({
  amount,
  avatar,
  nameEmail,
  profession,
  nameIdType,
  taxes,
  taxesAmount,
  total,
  onDelete,
}) => {
  const formatTime = ({ amount, type }: FormatTimeProps): string => {
    let unit: string

    switch (type) {
      case 'priceHour':
        unit = amount === 1 ? 'hour' : 'hours'
        break
      case 'priceDay':
        unit = amount === 1 ? 'day' : 'days'
        break
    }

    return `${amount} ${unit}`
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.avatarColumn}>
        <div className={styles.avatar}>
          <img
            alt='Avatar'
            src={
              avatar
                ? `${avatar}?width=128&height=128`
                : '/profileWithoutAvatar.svg'
            }
          />
        </div>
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
        {formatTime({ amount, type: nameIdType })}
      </span>
      <div className={`${styleItem.taxesColumn} ${styles.itemsRow}`}>
        {taxes === 1 ? (
          <span className={styles.taxesItem}>No TAX</span>
        ) : (
          <>
            <img src='/icons/info.svg' alt='Info' />
            <span className={styles.taxesItem}>Included</span>
          </>
        )}
      </div>
      <div className={`${styleItem.amountColumn} ${styles.itemsColumn}`}>
        <span className={styles.amountItem}>{total}</span>
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
