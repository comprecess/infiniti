import styles from './ChevronExpandMoreVert.module.scss'
import { ArrowsExpandIcon } from '../../../shared/icons/ArrowsExpandIcon'
import { ChevronIcon } from '../../../shared/icons/ChevronIcon'
import { MoreVertIcon } from '../../../shared/icons/MoreVertIcon'

interface ChevronExpandMoreVertProps {
  openContent: boolean
  handleChevronClick: () => void
}

export const ChevronExpandMoreVert = ({
  openContent,
  handleChevronClick,
}: ChevronExpandMoreVertProps) => {
  return (
    <div className={styles.wrapper}>
      <ChevronIcon
        stroke={
          openContent
            ? `${styles.strokeHoverIcon} ${styles.icon}`
            : `${styles.strokeHoverIcon} ${styles.icon} ${styles.rotate}`
        }
        onClick={handleChevronClick}
      />
      <ArrowsExpandIcon
        stroke={`${styles.strokeHoverIcon} ${styles.icon}`}
      />
      <MoreVertIcon fill={`${styles.fillHoverIcon} ${styles.icon}`} />
    </div>
  )
}
