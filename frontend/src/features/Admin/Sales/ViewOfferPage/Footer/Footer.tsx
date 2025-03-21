import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import { TotalItem } from '../../ViewInvoice/Footer/TotalItem/TotalItem'
import styles from './Footer.module.scss'

interface FooterProps {
  subtotal: string
  tax: string
  discount: string
  grandTotal: string
  notes: string
}

export const Footer = ({
  subtotal,
  tax,
  discount,
  grandTotal,
  notes,
}: FooterProps) => {
  const safeHTMLNotes = sanitizeMessage(notes)

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.totalList}>
          <TotalItem title='Subtotal' value={subtotal} />
          <TotalItem title='Discount' value={discount} />
          <TotalItem title='Tax' value={tax} />
          <TotalItem title='Grand Total' value={grandTotal} />
        </div>
      </div>
      {notes && (
        <div className={styles.offerTo}>
          <span className={styles.offerToTitle}>Customer Notes:</span>
          <span
            dangerouslySetInnerHTML={{
              __html: safeHTMLNotes,
            }}
            className={styles.message}
          />
        </div>
      )}
    </div>
  )
}
