import { FC } from 'react'

import { ArrowsExpandIcon } from '../../../shared/icons/ArrowsExpandIcon'
import { MoreVertIcon } from '../../../shared/icons/MoreVertIcon'
import { RefreshIcon } from '../../../shared/icons/RefreshIcon'
import styles from './UpdateExpandMoreVert.module.scss'

export const UpdateExpandMoreVert: FC = () => {
  return (
    <div className={styles.wrapper}>
      <RefreshIcon stroke={`${styles.strokeHoverIcon} ${styles.icon}`} />
      <ArrowsExpandIcon
        stroke={`${styles.strokeHoverIcon} ${styles.icon}`}
      />
      <MoreVertIcon fill={`${styles.fillHoverIcon} ${styles.icon}`} />
    </div>
  )
}
