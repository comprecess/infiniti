import { FC } from 'react'

import { ProfileInfo } from '../../../../../app/data/general/profile'
import styles from './CurrentBalance.module.scss'

export const CurrentBalance: FC = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Current balance</span>
      <h3 className={styles.currentBalance}>{ProfileInfo.currentBalance}</h3>
    </div>
  )
}
