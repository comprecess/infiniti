import { FC } from 'react'

import { TalentInfoData } from '../../../../app/data/client/talentInfo'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { ListInfoItem } from '../ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../TextInfoItem/TextInfoItem'
import { TitleCard } from '../TitleCard/TitleCard'
import styles from './ProjectsExperienceCard.module.scss'

export const ProjectsExperienceCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TitleCard title='Projects and experience' />
      <h5 className={styles.miniTitle}>ACME LLC</h5>
      <div className={styles.list}>
        {TalentInfoData[1].item.map(item => {
          if (typeof item.description === 'string') {
            return (
              <TextInfoItem
                key={item.title}
                title={item.title}
                text={item.description}
              />
            )
          } else if (Array.isArray(item.description)) {
            return (
              <ListInfoItem
                key={item.title}
                title={item.title}
                list={item.description}
              />
            )
          }
        })}
      </div>
      <div className={styles.divider}>
        <CustomDivider />
      </div>
      <h5 className={styles.miniTitle}>ACME LLC</h5>
      <div className={styles.list}>
        {TalentInfoData[1].item.map(item => {
          if (typeof item.description === 'string') {
            return (
              <TextInfoItem
                key={item.title}
                title={item.title}
                text={item.description}
              />
            )
          } else if (Array.isArray(item.description)) {
            return (
              <ListInfoItem
                key={item.title}
                title={item.title}
                list={item.description}
              />
            )
          }
        })}
      </div>
    </div>
  )
}
