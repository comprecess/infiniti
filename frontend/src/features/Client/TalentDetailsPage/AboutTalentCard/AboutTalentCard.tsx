import { TalentData } from '../../../../app/constants/constants'
import { ListInfoItem } from '../ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../TextInfoItem/TextInfoItem'
import { TitleCard } from '../TitleCard/TitleCard'
import styles from './AboutTalentCard.module.scss'

interface AboutTalentCardProps {
  talentInfo: TalentData
}

export const AboutTalentCard = ({ talentInfo }: AboutTalentCardProps) => {
  const getYearText = (years: number) => {
    if (years === null) return ''

    return `${years} ${years === 1 ? 'year' : 'years'}`
  }

  const experienceYear = talentInfo.experience
    ? talentInfo.experience.year
    : 0

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
          text={getYearText(experienceYear)}
        />
        <TextInfoItem title={'Timezone'} text={talentInfo.timezone} />
      </div>
    </div>
  )
}
