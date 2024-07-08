import { FC } from 'react'

import { ArrowsExpandIcon } from '../../../shared/icons/ArrowsExpandIcon'
import { ChevronIcon } from '../../../shared/icons/ChevronIcon'
import { MoreVertIcon } from '../../../shared/icons/MoreVertIcon'
import styles from './ChevronExpandMoreVert.module.scss'

interface ChevronExpandMoreVertProps {
  openContent: boolean
  handleChevronClick: () => void
}

export const ChevronExpandMoreVert: FC<ChevronExpandMoreVertProps> = ({
  openContent,
  handleChevronClick,
}) => {
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
