import { FC, PropsWithChildren } from 'react'

import { ArrowsExpandIcon } from '../../shared/icons/ArrowsExpandIcon'
import { ChevronIcon } from '../../shared/icons/ChevronIcon'
import { MoreVertIcon } from '../../shared/icons/MoreVertIcon'
import { RefreshIcon } from '../../shared/icons/RefreshIcon'
import styles from './RecentCard.module.scss'

interface RecentCardProps {
  title?: string
  style?: string
  rightIcons?: boolean
  updateIcon?: boolean
}

export const RecentCard: FC<PropsWithChildren<RecentCardProps>> = ({
  title,
  style,
  rightIcons = false,
  updateIcon = false,
  children,
}) => {
  return (
    <div className={`${styles.wrapper} ${style}`}>
      {title ? (
        rightIcons ? (
          <div className={styles.items}>
            <h6 className={styles.title}>{title}</h6>
            <div className={styles.itemsIcons}>
              {updateIcon ? (
                <RefreshIcon
                  stroke={`${styles.strokeHoverIcon} ${styles.icon}`}
                />
              ) : (
                <ChevronIcon
                  stroke={`${styles.strokeHoverIcon} ${styles.icon}`}
                />
              )}
              <ArrowsExpandIcon
                stroke={`${styles.strokeHoverIcon} ${styles.icon}`}
              />
              <MoreVertIcon fill={`${styles.fillHoverIcon} ${styles.icon}`} />
            </div>
          </div>
        ) : (
          <h6 className={styles.title}>{title}</h6>
        )
      ) : null}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
