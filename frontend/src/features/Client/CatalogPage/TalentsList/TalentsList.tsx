import { FC } from 'react'

import { TalentsListData } from '../../../../app/data/client/talentsList'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'
import styles from './TalentsList.module.scss'

export const TalentsList: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3 className={styles.name}>Talents</h3>
          <h3 className={styles.number}>{TalentsListData.length}</h3>
        </div>
        <div className={styles.sortList}>Sort</div>
      </div>
      <div className={styles.talentsList}>
        {TalentsListData.map(talent => {
          return <TalentsCard key={talent.id} talentInfo={talent} />
        })}
      </div>
    </div>
  )
}
