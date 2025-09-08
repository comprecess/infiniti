import {
  SalesViewInvoiceDocuments,
  SalesViewInvoiceTransactions,
} from '../../../../../app/constants/constants'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './Footer.module.scss'
import { RecentFiles } from './RecentFiles/RecentFiles'
import { RecentTransactions } from './RecentTransactions/RecentTransactions'
import { TotalItem } from './TotalItem/TotalItem'

interface FooterProps {
  subtotal: string
  tax: string
  discount: string
  grandTotal: string
  note: string
  transactions: SalesViewInvoiceTransactions[]
  documents: SalesViewInvoiceDocuments[]
}

export const Footer = ({
  subtotal,
  tax,
  discount,
  grandTotal,
  note,
  transactions,
  documents,
}: FooterProps) => {
  const safeHTML = sanitizeMessage(note)

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
      <div className={styles.transactionsContainer}>
        <span className={styles.transactionsTitle}>
          Related Transactions
        </span>
        <div className={styles.transactionsContent}>
          <RecentTransactions transactionsList={transactions} />
        </div>
        <div className={styles.transactionsContent}>
          <RecentFiles filesList={documents} />
        </div>
      </div>
      {note && (
        <div className={styles.noteWrapper}>
          <span className={styles.titleNote}>Note:</span>
          <span
            dangerouslySetInnerHTML={{ __html: safeHTML }}
            className='dangerouslySetInnerHTML'
          />
        </div>
      )}
    </div>
  )
}
