import { FC } from 'react'

import styles from './TalentsCard.module.scss'

interface TalentInfo {
  name: string
  level: string
  specialization: string
  location: string
  industries: string[]
  keySkills: string[]
  dailyRate: string
  hourlyRate: string
}

interface TalentsCardProps {
  talentInfo: TalentInfo
}

export const TalentsCard: FC<TalentsCardProps> = ({ talentInfo }) => {
  return (
    <div className={styles.wrapper}>
      <span>{talentInfo.name}</span>
      <span>{talentInfo.level}</span>
    </div>
  )
}
