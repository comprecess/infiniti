import React, { FC } from 'react'

import { TalentData } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { TitleCard } from '../TitleCard/TitleCard'
import { Item } from './Item/Item'
import styles from './ProjectsExperienceCard.module.scss'

interface ProjectsExperienceCardProps {
  talentInfo: TalentData
}

export const ProjectsExperienceCard: FC<ProjectsExperienceCardProps> = ({
  talentInfo,
}) => {
  const getYearText = (years: number, months: number) => {
    let dataText = ''

    if (years > 0) {
      dataText += `${years} ${years === 1 ? 'year' : 'years'}`
    }

    if (months > 0) {
      dataText += ` ${months} ${months === 1 ? 'month' : 'months'}`
    }

    return dataText
  }

  const experienceYear = talentInfo.experience ? talentInfo.experience.year : 0
  const experienceMonth = talentInfo.experience
    ? talentInfo.experience.month
    : 0

  return (
    <div className={styles.wrapper}>
      <TitleCard
        title='Projects and experience'
        secondTitle={getYearText(experienceYear, experienceMonth)}
      />
      {talentInfo.blockExperience.map((item, index) => {
        return (
          <React.Fragment key={item.id}>
            <Item
              name={item.name}
              position={item.position}
              period={`${item.periodFrom} — ${item.periodTo}`}
              responsibilities={item.responsibilities}
            />
            {index !== talentInfo.blockExperience.length - 1 && (
              <div className={styles.divider}>
                <CustomDivider />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
