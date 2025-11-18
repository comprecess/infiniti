import { useState } from 'react'

import styles from './LogsTable.module.scss'
import { LoadingSpinner } from '../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'

export const LogsTable = () => {
  const [logsData] = useState(null)

  if (!logsData) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    )
  }

  return <div>LogsTable</div>
}
