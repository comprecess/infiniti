import styles from './Item.module.scss'
import { Routes } from '../../../../../app/router/routes'
import { Status } from '../../../../../shared/ui/Status/Status'
import { ManageButtons } from '../../../../Main/RecentCard/ManageButtons/ManageButtons'
import styleItem from '../RecentInvoices.module.scss'

interface ItemProps {
  code: string
  amount: string
  invoiceDate: string
  dueDate: string
  status: string
  public: string
}

export const Item = ({
  code,
  amount,
  invoiceDate,
  dueDate,
  status,
  public: publicCode,
}: ItemProps) => {
  const handleNavigateToView = () => {
    const url = `/${Routes.public}/${Routes.invoice}/${Routes.view}/${publicCode}`

    window.open(url, '_blank')
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.hashtagColumn} ${styles.hashtagItem}`}
        onClick={handleNavigateToView}
      >
        {code}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span
        className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}
      >
        {invoiceDate}
      </span>
      <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>
        {dueDate}
      </span>
      <div className={`${styleItem.statusColumn} ${styles.statusItem}`}>
        <Status title={status} status={status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <ManageButtons
          firstButtonTitle='View'
          thirdButtonTitle='Download'
          firstClick={handleNavigateToView}
        />
      </div>
    </div>
  )
}
