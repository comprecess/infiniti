import { FC } from 'react'

import { TalentData } from '../../../../app/constants/constants'
import { ListInfoItem } from '../ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../TextInfoItem/TextInfoItem'
import { TitleCard } from '../TitleCard/TitleCard'
import styles from './AboutTalentCard.module.scss'

interface AboutTalentCardProps {
  talentInfo: TalentData
}

export const AboutTalentCard: FC<AboutTalentCardProps> = ({
  talentInfo,
}) => {
  const getYearText = (years: number) => {
    return `${years} ${years === 1 ? 'year' : 'years'}`
  }

  return (
    <div className={styles.wrapper}>
      <TitleCard title='About talent' />
      <div className={styles.list}>
        <TextInfoItem
          title={'Specialization'}
          text={talentInfo.specialization}
        />
        <ListInfoItem title={'Industries'} list={talentInfo.industries} />
        <ListInfoItem title={'Key skills'} list={talentInfo.keySkills} />
        <ListInfoItem title={'All skills'} list={talentInfo.allSkills} />
        <TextInfoItem title={'Language'} text={talentInfo.language} />
        <TextInfoItem
          title={'Experience'}
          text={getYearText(talentInfo.experience.year)}
        />
        <TextInfoItem title={'Timezone'} text={talentInfo.timezone} />
      </div>
    </div>
  )
}
