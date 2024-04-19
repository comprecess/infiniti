import { FC } from 'react'

import styles from './Status.module.scss'

interface StatusProps {
  title: string
  status: string
}

const statusColors = {
  Unpaid: styles.statusUnpaid,
  Pending: styles.statusPending,
  Paid: styles.statusPaid,
  Active: styles.statusActive,
  Draft: styles.statusDraft,
}

export const Status: FC<StatusProps> = ({ title, status }) => {
  let statusStyle = ''

  switch (status) {
    case 'Unpaid':
      statusStyle = statusColors.Unpaid
      break
    case 'Pending':
      statusStyle = statusColors.Pending
      break
    case 'Paid':
      statusStyle = statusColors.Paid
      break
    case 'Active':
      statusStyle = statusColors.Active
      break
    case 'Draft':
      statusStyle = statusColors.Draft
      break
  }

  return (
    <div className={`${styles.wrapper} ${statusStyle}`}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
