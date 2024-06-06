import { FC } from 'react'

import { TitleCard } from '../TitleCard/TitleCard'
import styles from './EducationCard.module.scss'

export const EducationCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TitleCard title='Education' />
    </div>
  )
}
