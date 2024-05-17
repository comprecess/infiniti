import { FC } from 'react'

import styles from './TalentsList.module.scss'

export const TalentsList: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3 className={styles.name}>Talents</h3>
          <h3 className={styles.number}>Title</h3>
        </div>
        <div className={styles.sortList}>Sort</div>
      </div>
      <div className={styles.talentsList}>Talents List</div>
    </div>
  )
}
