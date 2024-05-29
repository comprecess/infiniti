import { FC } from 'react'

import { ArrowItem } from './ArrowItem/ArrowItem'
import styles from './PagesList.module.scss'

interface PagesListProps {
  leftButtonDisabled: boolean
  leftButtonOnClick: () => void
  rightButtonDisabled: boolean
  rightButtonOnClick: () => void
}

export const PagesList: FC<PagesListProps> = ({
  leftButtonDisabled,
  leftButtonOnClick,
  rightButtonDisabled,
  rightButtonOnClick,
}) => {
  return (
    <div className={styles.wrapper}>
      <ArrowItem
        disabled={leftButtonDisabled}
        onClick={leftButtonOnClick}
      />
      <ArrowItem
        isLeftArrow={false}
        disabled={rightButtonDisabled}
        onClick={rightButtonOnClick}
      />
    </div>
  )
}
