import styles from './SimilarTalents.module.scss'
import { TalentsProps } from '../../../../app/constants/constants'
import { TalentsCard } from '../../../../widgets/TalentsCard/TalentsCard'

interface SimilarTalentsProps {
  similarTalents: TalentsProps[]
}

export const SimilarTalents = ({
  similarTalents,
}: SimilarTalentsProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Similar talents</h2>
      <div className={styles.list}>
        {similarTalents.slice(0, 3).map(similar => {
          return <TalentsCard key={similar.id} talent={similar} />
        })}
      </div>
    </div>
  )
}
