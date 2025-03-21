import { TalentData } from '../../../../app/constants/constants'
import { TextInfoItem } from '../TextInfoItem/TextInfoItem'
import { TitleCard } from '../TitleCard/TitleCard'
import styles from './EducationCard.module.scss'

interface EducationCardProps {
  talentInfo: TalentData
}

export const EducationCard = ({ talentInfo }: EducationCardProps) => {
  return (
    <div className={styles.wrapper}>
      <TitleCard title='Education' />
      <h5 className={styles.miniTitle}>{talentInfo.educationName}</h5>
      <div className={styles.list}>
        <TextInfoItem
          title={'Specialization'}
          text={talentInfo.educationSpecialization}
        />
        <TextInfoItem title={'Degree'} text={talentInfo.educationDegree} />
        <TextInfoItem
          title={'Graduation'}
          text={talentInfo.educationGraduation}
        />
      </div>
    </div>
  )
}
