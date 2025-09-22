import styles from './UpdateExpandMoreVert.module.scss'
import { ArrowsExpandIcon } from '../../../shared/icons/ArrowsExpandIcon'
import { MoreVertIcon } from '../../../shared/icons/MoreVertIcon'
import { RefreshIcon } from '../../../shared/icons/RefreshIcon'

export const UpdateExpandMoreVert = () => {
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
