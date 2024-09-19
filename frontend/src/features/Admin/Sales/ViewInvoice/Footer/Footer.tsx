import { FC } from 'react'

import styles from './Footer.module.scss'
import { TotalItem } from './TotalItem/TotalItem'

interface FooterProps {
  subtotal: string
  tax: string
  discount: string
  grandTotal: string
  note: string
}

export const Footer: FC<FooterProps> = ({
  subtotal,
  tax,
  discount,
  grandTotal,
  note,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.totalList}>
        <TotalItem title='Subtotal' value={subtotal} />
        <TotalItem title='Discount' value={discount} />
        <TotalItem title='Tax' value={tax} />
        <TotalItem title='Grand Total' value={grandTotal} />
      </div>
      {note && (
        <div className={styles.noteWrapper}>
          <span className={styles.titleNote}>Note:</span>
          <span
            dangerouslySetInnerHTML={{ __html: note }}
            className={styles.note}
          />
        </div>
      )}
    </div>
  )
}
