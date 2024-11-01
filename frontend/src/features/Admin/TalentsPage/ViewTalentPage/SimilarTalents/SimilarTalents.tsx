import { FC } from 'react'

import { TalentsProps } from '../../../../../app/constants/constants'
import { TalentsCard } from '../../../../../widgets/TalentsCard/TalentsCard'
import styles from './SimilarTalents.module.scss'

interface SimilarTalentsProps {
  isAdmin?: boolean
  similarTalents: TalentsProps[]
}

export const SimilarTalents: FC<SimilarTalentsProps> = ({
  isAdmin = false,
  similarTalents,
}) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Similar talents</h2>
      <div className={styles.list}>
        {similarTalents.map(similar => {
          return (
            <TalentsCard
              key={similar.id}
              isAdmin={isAdmin}
              talent={similar}
            />
          )
        })}
      </div>
    </div>
  )
}
