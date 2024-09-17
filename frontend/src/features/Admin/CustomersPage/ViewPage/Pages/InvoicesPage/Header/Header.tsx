import { FC } from 'react'

import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { TotalItem } from '../TotalItem/TotalItem'
import styles from './Header.module.scss'

interface HeaderProps {
  invoiceAmount: string
  paidAmount: string
  unPaidAmount: string
}

export const Header: FC<HeaderProps> = ({
  invoiceAmount,
  paidAmount,
  unPaidAmount,
}) => {
  return (
    <div className={styles.wrapper}>
      <ButtonBlue title='New Invoice' style={styles.buttonNewInvoices} />
      <div className={styles.totalInfoList}>
        <TotalItem
          title='Invoice Amount'
          value={invoiceAmount}
          color={styles.totalInvoiceAmount}
        />
        <TotalItem
          title='Paid Amount'
          value={paidAmount}
          color={styles.totalPaidAmount}
        />
        <TotalItem
          title='Un Paid Amount'
          value={unPaidAmount}
          color={styles.totalUnPaidAmount}
        />
      </div>
    </div>
  )
}
