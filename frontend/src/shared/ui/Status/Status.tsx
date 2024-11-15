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
  Started: styles.statusStarted,
  Paused: styles.statusPaused,
  Completed: styles.statusCompleted,
  PartiallyPaid: styles.statusPartiallyPaid,
  Accepted: styles.statusAccepted,
  Cancelled: styles.statusCancelled,
  Dead: styles.statusDead,
  Delivered: styles.statusDelivered,
  Lost: styles.statusLost,
  Decline: styles.statusDecline,
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
    case 'Started':
      statusStyle = statusColors.Started
      break
    case 'Paused':
      statusStyle = statusColors.Paused
      break
    case 'Completed':
      statusStyle = statusColors.Completed
      break
    case 'Partially Paid':
      statusStyle = statusColors.PartiallyPaid
      break
    case 'Accepted':
      statusStyle = statusColors.Accepted
      break
    case 'Cancelled':
      statusStyle = statusColors.Cancelled
      break
    case 'Dead':
      statusStyle = statusColors.Dead
      break
    case 'Delivered':
      statusStyle = statusColors.Delivered
      break
    case 'Lost':
      statusStyle = statusColors.Lost
      break
    case 'Decline':
      statusStyle = statusColors.Decline
      break
  }

  return (
    <div className={`${styles.wrapper} ${statusStyle}`}>
      <span className={styles.title}>{title}</span>
    </div>
  )
}
