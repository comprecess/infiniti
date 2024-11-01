import { FC } from 'react'

import { TalentsProps } from '../../app/constants/constants'
import { CustomDivider } from '../../shared/ui/CustomDivider/CustomDivider'
import { Body } from './Body/Body'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import styles from './TalentsCard.module.scss'

interface TalentsCardProps {
  isAdmin?: boolean
  talent: TalentsProps
  deleteTalent?: (idTalent: number) => void
}

export const TalentsCard: FC<TalentsCardProps> = ({
  talent,
  isAdmin = false,
  deleteTalent,
}) => {
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
        isAdmin={isAdmin}
        dailyRate={talent.priceDay}
        hourlyRate={talent.priceHour}
        deleteTalent={deleteTalent}
      />
    </div>
  )
}
