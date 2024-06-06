import { FC } from 'react'

import { TitleCard } from '../TitleCard/TitleCard'
import styles from './AboutTalentCard.module.scss'

export const AboutTalentCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TitleCard title='About talent' />
    </div>
  )
}
