import { FC } from 'react'

import {
  UserInfo,
  UserPropertiesProps,
} from '../../app/constants/constants'
import { CustomDivider } from '../../shared/ui/CustomDivider/CustomDivider'
import { Body } from './Body/Body'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import styles from './TalentsCard.module.scss'

interface TalentsCardProps {
  id: number
  properties: UserPropertiesProps[]
  user: UserInfo
}

export const TalentsCard: FC<TalentsCardProps> = ({ id, user }) => {
  return (
    <div className={styles.wrapper}>
      <Header
        avatar={user?.img ? user?.img : '/profileWithoutAvatar.svg'}
        name={user?.account}
        specialization={'specialization'}
        location={'location'}
        level={'level'}
      />
      <CustomDivider />
      <Body
        //keySkills={properties[1].value.slice(0, 3).map(item => item.value)}
        keySkills={['key skills']}
        //industries={properties[0].value
        //  .slice(0, 3)
        //  .map(item => item.value)}
        industries={['industries']}
      />
      <CustomDivider />
      <Footer id={id} dailyRate={'dailyRate'} hourlyRate={'hourlyRate'} />
    </div>
  )
}
