import { FC } from 'react'

import { TalentsProps } from '../../app/constants/constants'
import { CustomDivider } from '../../shared/ui/CustomDivider/CustomDivider'
import { Body } from './Body/Body'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import styles from './TalentsCard.module.scss'

interface TalentsCardProps {
  talent: TalentsProps
}

export const TalentsCard: FC<TalentsCardProps> = ({ talent }) => {
  return (
    <div className={styles.wrapper}>
      <Header
        avatar={talent?.img ? talent?.img : '/profileWithoutAvatar.svg'}
        name={talent?.name}
        specialization={talent.specialization}
        location={talent.timezone}
        level={talent.level}
      />
      <CustomDivider />
      <Body industries={talent.industries} keySkills={talent.keySkills} />
      <CustomDivider />
      <Footer
        id={talent.id}
        dailyRate={talent.priceDay}
        hourlyRate={talent.priceHour}
      />
    </div>
  )
}
