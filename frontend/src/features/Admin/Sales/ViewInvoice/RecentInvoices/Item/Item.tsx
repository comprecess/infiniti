import styles from './Item.module.scss'
import { sanitizeMessage } from '../../../../../../shared/utils/TextEditor/sanitizeMessage'
import styleItem from '../RecentInvoices.module.scss'

interface ItemProps {
  code: number
  item: string
  price: number
  qty: number
  discount: number
  total: number
}

export const Item = ({
  code,
  item,
  price,
  qty,
  discount,
  total,
}: ItemProps) => {
  const safeHTML = sanitizeMessage(item)

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.codeColumn} ${styles.codeItem}`}>
        {code}
      </span>
      <span
        dangerouslySetInnerHTML={{ __html: safeHTML }}
        className={`${styleItem.itemColumn} ${styles.itemItem}`}
      />
      <span className={`${styleItem.priceColumn} ${styles.priceItem}`}>
        {price}
      </span>
      <span className={`${styleItem.qtyColumn} ${styles.qtyItem}`}>
        {qty}
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
