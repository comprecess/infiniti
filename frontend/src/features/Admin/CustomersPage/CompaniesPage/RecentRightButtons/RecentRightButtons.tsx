import { FC } from 'react'

import styles from './RecentRightButtons.module.scss'

export const RecentRightButtons: FC = () => {
  return (
    <div className={styles.wrapper}>
      <button className={styles.buttonPDF}>
        <span className={styles.name}>PDF</span>
      </button>
      <button className={styles.buttonExcel}>
        <span className={styles.name}>Excel</span>
      </button>
      <button className={styles.buttonCSV}>
        <span className={styles.name}>CSV</span>
      </button>
      <button className={styles.buttonCopy}>
        <span className={styles.name}>Copy</span>
      </button>
      <button className={styles.buttonPrint}>
        <span className={styles.name}>Print</span>
      </button>
    </div>
  )
}
