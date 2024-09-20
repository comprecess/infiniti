import { FC, useEffect } from 'react'

import styles from './InvoiceViewPage.module.scss'

export const InvoiceViewPage: FC = () => {
  useEffect(() => {
    document.title = 'Infiniti | Preview Invoice'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.pdfButtons}>Buttons</div>
        <div className={styles.header}>Header Info</div>
        <div className={styles.table}>Table</div>
        <div className={styles.total}>Total Info</div>
        <div className={styles.note}>Note</div>
      </div>
    </div>
  )
}
