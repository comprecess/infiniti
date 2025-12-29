import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ResponsiveRow } from '../../../../../shared/ui/ExpandableRow/ResponsiveRow'
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
    <ResponsiveRow
      hiddenFields={[
        {
          label: 'Account:',
          value: <span className={styles.accountItemMobile}>{account}</span>,
          onClick: handleNavigateToClient,
        },
        { label: 'Amount:', value: <span className={styles.amountItemMobile}>{amount}</span> },
        { label: 'Created:', value: <span className={styles.createdItemMobile}>{created}</span> },
        { label: 'Due:', value: <span className={styles.dueItemMobile}>{due}</span> },
      ]}
      visibleFields={[
        {
          label: 'Hashtag',
          value: <span className={styles.hashtagItem}>{hashtag}</span>,
          className: styleItem.hashtagColumn,
          onClick: handleNavigateToInvoice,
        },
        {
          label: 'Account:',
          value: <span className={styles.accountItem}>{account}</span>,
          className: styleItem.accountColumn,
          onClick: handleNavigateToClient,
        },
        {
          label: 'Amount:',
          value: <span className={styles.amountItem}>{amount}</span>,
          className: styleItem.amountColumn,
        },
        {
          label: 'Created:',
          value: <span className={styles.createdItem}>{created}</span>,
          className: styleItem.createdColumn,
        },
        {
          label: 'Due:',
          value: <span className={styles.dueItem}>{due}</span>,
          className: styleItem.dueColumn,
        },
        {
          label: 'Status',
          value: <Status title={status} status={status} />,
          className: styleItem.statusColumn,
        },
      ]}
    />
  )
}
