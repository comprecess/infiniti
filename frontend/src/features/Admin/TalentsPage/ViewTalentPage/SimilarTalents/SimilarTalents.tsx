import styles from './SimilarTalents.module.scss'
import {
  RolesAccess,
  TalentsProps,
} from '../../../../../app/constants/constants'
import { TalentsCard } from '../../../../../widgets/TalentsCard/TalentsCard'

interface SimilarTalentsProps {
  isAdmin?: boolean
  similarTalents: TalentsProps[]
  roles?: { [key: string]: RolesAccess }
}

export const SimilarTalents = ({
  isAdmin = false,
  similarTalents,
  roles,
}: SimilarTalentsProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Similar talents</h2>
      <div className={styles.list}>
        {similarTalents.slice(0, 3).map(similar => {
          return (
            <TalentsCard
              key={similar.id}
              access={roles ? roles.talent : undefined}
              isAdmin={isAdmin}
              talent={similar}
            />
          )
        })}
      </div>
    </div>
  )
}
