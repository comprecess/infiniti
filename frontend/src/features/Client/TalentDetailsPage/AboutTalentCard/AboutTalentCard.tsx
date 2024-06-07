import { FC } from 'react'

import { TalentInfoData } from '../../../../app/data/client/talentInfo'
import { ListInfoItem } from '../ListInfoItem/ListInfoItem'
import { TextInfoItem } from '../TextInfoItem/TextInfoItem'
import { TitleCard } from '../TitleCard/TitleCard'
import styles from './AboutTalentCard.module.scss'

export const AboutTalentCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TitleCard title='About talent' />
      <div className={styles.list}>
        {TalentInfoData[0].item.map(item => {
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
