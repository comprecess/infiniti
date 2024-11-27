import { FC } from 'react'

import { ViewInvoicesProps } from '../../../../../../../../app/constants/constants'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { Status } from '../../../../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  item: ViewInvoicesProps
  navigateToViewInvoice: (id: number) => void
  navigateToEditInvoice: (id: number) => void
}

export const Item: FC<ItemProps> = ({
  item,
  navigateToViewInvoice,
  navigateToEditInvoice,
}) => {
  const handleNavigateToViewInvoice = () => {
    navigateToViewInvoice(item.id)
  }

  const handleNavigateToEditInvoice = () => {
    navigateToEditInvoice(item.id)
  }

  return (
    <div className={styles.wrapper}>
      <span className={`${styleItem.codeColumn} ${styles.codeItem}`}>
        {item.code}
      </span>
      <span className={`${styleItem.accountColumn} ${styles.accountItem}`}>
        {item.account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {item.total}
      </span>
      <span
        className={`${styleItem.invoiceDateColumn} ${styles.invoiceDateItem}`}
      >
        {item.date}
      </span>
      <span className={`${styleItem.dueDateColumn} ${styles.dueDateItem}`}>
        {item.dueDate}
      </span>
      <div className={styleItem.statusColumn}>
        <Status title={item.status} status={item.status} />
      </div>
      <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
        <CustomMiniButton
          style='mint'
          icon='/icons/view.svg'
          alt='View'
          tooltipTitle='View'
          onClick={handleNavigateToViewInvoice}
        />
        <CustomMiniButton
          style='amber'
          icon='/icons/edit.svg'
          alt='Edit'
          tooltipTitle='Edit'
          onClick={handleNavigateToEditInvoice}
        />
      </div>
    </div>
  )
}
