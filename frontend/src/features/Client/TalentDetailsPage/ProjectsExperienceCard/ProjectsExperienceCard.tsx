import { FC } from 'react'

import { TitleCard } from '../TitleCard/TitleCard'
import styles from './ProjectsExperienceCard.module.scss'

export const ProjectsExperienceCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TitleCard title='Projects and experience' />
    </div>
  )
}
