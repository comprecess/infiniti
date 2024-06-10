import { FC } from 'react'

import { TalentsListData } from '../../../../app/data/client/talentsList'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'
import styles from './SimilarTalents.module.scss'

export const SimilarTalents: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Similar talents</h2>
      <div className={styles.list}>
        <TalentsCard talentInfo={TalentsListData[5]} />
        <TalentsCard talentInfo={TalentsListData[12]} />
        <TalentsCard talentInfo={TalentsListData[20]} />
      </div>
    </div>
  )
}
