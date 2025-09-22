import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { Status } from '../../../../../shared/ui/Status/Status'
import styleItem from '../RecentInvoices.module.scss'

interface ItemProps {
  invoiceId: number
  clientId: number
  hashtag: string
  account: string
  amount: string
  created: string
  due: string
  status: string
  roles?: { [key: string]: RolesAccess }
}

export const Item = ({
  invoiceId,
  clientId,
  hashtag,
  account,
  amount,
  created,
  due,
  status,
  roles,
}: ItemProps) => {
  const navigate = useNavigate()

  const handleNavigateToInvoice = () => {
    if (roles && roles.sales.view === 0) {
      navigate(`/403`)
    } else {
      navigate(
        `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${invoiceId}`,
      )
    }
  }

  const handleNavigateToClient = () => {
    if (roles && roles.customers.view === 0) {
      navigate(`/403`)
    } else {
      navigate(
        `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${clientId}/${Routes.summary}`,
      )
    }
  }

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styleItem.hashtagColumn} ${styles.hashtagItem}`}
        onClick={handleNavigateToInvoice}
      >
        {hashtag}
      </span>
      <span
        className={`${styleItem.accountColumn} ${styles.accountItem}`}
        onClick={handleNavigateToClient}
      >
        {account}
      </span>
      <span className={`${styleItem.amountColumn} ${styles.amountItem}`}>
        {amount}
      </span>
      <span className={`${styleItem.createdColumn} ${styles.createdItem}`}>
        {created}
      </span>
      <span className={`${styleItem.dueColumn} ${styles.dueItem}`}>
        {due}
      </span>
      <div className={`${styleItem.statusColumn} ${styles.statusItem}`}>
        <Status title={status} status={status} />
      </div>
    </div>
  )
}
