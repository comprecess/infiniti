import { RolesAccess } from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { TotalItem } from '../TotalItem/TotalItem'
import styles from './Header.module.scss'

interface HeaderProps {
  access: RolesAccess | undefined
  invoiceAmount: string
  paidAmount: string
  unPaidAmount: string
  onClickButton: () => void
}

export const Header = ({
  access,
  invoiceAmount,
  paidAmount,
  unPaidAmount,
  onClickButton,
}: HeaderProps) => {
  return (
    <div className={styles.wrapper}>
      {access && access.create === 0 ? (
        <div style={{ display: 'none' }} />
      ) : (
        <ButtonBlue
          title='New Invoice'
          style={styles.buttonNewInvoices}
          onClick={onClickButton}
        />
      )}
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
