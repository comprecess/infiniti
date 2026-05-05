import styles from './LeadStatusBadge.module.scss'

interface LeadStatusBadgeProps {
  status: string
}

const STATUS_CLASSES: Record<string, string> = {
  'New': 'new',
  'In Progress': 'inProgress',
  'Working': 'inProgress',
  'Nurturing': 'nurturing',
  'Qualified': 'qualified',
  'Unqualified': 'unqualified',
  'Closed': 'closed',
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const className = STATUS_CLASSES[status] || 'default'

  return <span className={`${styles.badge} ${styles[className] || styles.default}`}>{status}</span>
}
