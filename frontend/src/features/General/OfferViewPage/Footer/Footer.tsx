import { FC } from 'react'

import { TotalItem } from '../../../Admin/Sales/ViewInvoice/Footer/TotalItem/TotalItem'
import styles from './Footer.module.scss'

interface FooterProps {
  subtotal: string
  tax: string
  discount: string
  grandTotal: string
}

export const Footer: FC<FooterProps> = ({
  subtotal,
  tax,
  discount,
  grandTotal,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.totalList}>
        <TotalItem title='Subtotal' value={subtotal} />
        <TotalItem title='Discount' value={discount} />
        <TotalItem title='Tax' value={tax} />
        <TotalItem title='Grand Total' value={grandTotal} />
      </div>
    </div>
  )
}
