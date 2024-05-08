import { FC } from 'react'

import styles from './LoadingSpinner.module.scss'

interface LoadingSpinnerProps {
  spinnerStyle: string
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  spinnerStyle,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.spinner} ${spinnerStyle}`} />
    </div>
  )
}
