import styles from './Status.module.scss'

interface StatusProps {
  title: string
  status: string
}

/**
 * Normalize raw database status values to human-readable labels
 * that match the Status component's styling cases.
 */
const normalizeStatus = (raw: string): { label: string; styleKey: string } => {
  const lower = raw.toLowerCase().replace(/[_\s]+/g, '_')

  switch (lower) {
    case 'draft':
      return { label: 'Draft', styleKey: 'Draft' }
    case 'active':
      return { label: 'Active', styleKey: 'Active' }
    case 'in_progress':
      return { label: 'In Progress', styleKey: 'Started' }
    case 'started':
      return { label: 'Started', styleKey: 'Started' }
    case 'completed':
      return { label: 'Completed', styleKey: 'Completed' }
    case 'paused':
      return { label: 'Paused', styleKey: 'Paused' }
    case 'cancelled':
      return { label: 'Cancelled', styleKey: 'Cancelled' }
    case 'unpaid':
      return { label: 'Unpaid', styleKey: 'Unpaid' }
    case 'pending':
      return { label: 'Pending', styleKey: 'Pending' }
    case 'paid':
      return { label: 'Paid', styleKey: 'Paid' }
    case 'partially_paid':
    case 'partially paid':
      return { label: 'Partially Paid', styleKey: 'PartiallyPaid' }
    case 'accepted':
      return { label: 'Accepted', styleKey: 'Accepted' }
    case 'dead':
      return { label: 'Dead', styleKey: 'Dead' }
    case 'delivered':
      return { label: 'Delivered', styleKey: 'Delivered' }
    case 'lost':
      return { label: 'Lost', styleKey: 'Lost' }
    case 'decline':
      return { label: 'Decline', styleKey: 'Decline' }
    case 'open':
      return { label: 'Open', styleKey: 'Open' }
    case 'closed':
      return { label: 'Closed', styleKey: 'Closed' }
    default:
      return { label: raw, styleKey: 'Draft' }
  }
}

const statusColors: Record<string, string> = {
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
  Open: styles.statusOpen,
  Closed: styles.statusClosed,
}

export const Status = ({ title, status }: StatusProps) => {
  const { label, styleKey } = normalizeStatus(status || title)
  const statusStyle = statusColors[styleKey] || ''

  return (
    <div className={`${styles.wrapper} ${statusStyle}`}>
      <span className={styles.title}>{label}</span>
    </div>
  )
}
