import { FC } from 'react'

import { CustomDivider } from '../../shared/ui/CustomDivider/CustomDivider'
import { Body } from './Body/Body'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import styles from './TalentsCard.module.scss'

interface TalentInfo {
  id: number
  avatar: string
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
      <Header
        avatar={talentInfo.avatar}
        name={talentInfo.name}
        specialization={talentInfo.specialization}
        location={talentInfo.location}
        level={talentInfo.level}
      />
      <CustomDivider />
      <Body
        industries={talentInfo.industries}
        keySkills={talentInfo.keySkills}
      />
      <CustomDivider />
      <Footer
        id={talentInfo.id}
        dailyRate={talentInfo.dailyRate}
        hourlyRate={talentInfo.hourlyRate}
      />
    </div>
  )
}
