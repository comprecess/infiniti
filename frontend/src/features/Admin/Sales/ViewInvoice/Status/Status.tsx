import { FC } from 'react'

import styles from './Status.module.scss'

interface StatusProps {
  status: string
}

const statusColors = {
  Unpaid: styles.statusUnpaid,
  Paid: styles.statusPaid,
  PartiallyPaid: styles.statusPartiallyPaid,
  Cancelled: styles.statusCancelled,
  Accepted: styles.statusAccepted,
  Dead: styles.statusDead,
  Delivered: styles.statusDelivered,
  Draft: styles.statusDraft,
  Lost: styles.statusLost,
}

export const Status: FC<StatusProps> = ({ status }) => {
  let statusStyle = ''

  switch (status) {
    case 'Unpaid':
      statusStyle = statusColors.Unpaid
      break
    case 'Paid':
      statusStyle = statusColors.Paid
      break
    case 'Partially Paid':
      statusStyle = statusColors.PartiallyPaid
      break
    case 'Cancelled':
      statusStyle = statusColors.Cancelled
      break
    case 'Accepted':
      statusStyle = statusColors.Accepted
      break
    case 'Dead':
      statusStyle = statusColors.Dead
      break
    case 'Delivered':
      statusStyle = statusColors.Delivered
      break
    case 'Draft':
      statusStyle = statusColors.Draft
      break
    case 'Lost':
      statusStyle = statusColors.Lost
      break
  }

  return (
    <div className={`${styles.wrapper} ${statusStyle}`}>
      <span className={styles.title}>{status}</span>
    </div>
  )
}
