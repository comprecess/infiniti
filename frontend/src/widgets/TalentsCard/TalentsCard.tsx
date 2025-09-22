import { Body } from './Body/Body'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import styles from './TalentsCard.module.scss'
import { RolesAccess, TalentsProps } from '../../app/constants/constants'
import { CustomDivider } from '../../shared/ui/CustomDivider/CustomDivider'

interface TalentsCardProps {
  isAdmin?: boolean
  talent: TalentsProps
  access?: RolesAccess
  addTalentInCart?: () => void
  deleteTalent?: (idTalent: number) => void
}

export const TalentsCard = ({
  talent,
  access,
  isAdmin = false,
  addTalentInCart,
  deleteTalent,
}: TalentsCardProps) => {
  return (
    <div className={styles.wrapper}>
      <Header
        name={talent.name}
        specialization={talent.specialization}
        location={talent.timezone}
        level={talent.level}
        avatar={
          talent.img
            ? `${talent.img}?width=128&height=128`
            : '/profileWithoutAvatar.svg'
        }
      />
      <CustomDivider />
      <Body industries={talent.industries} keySkills={talent.keySkills} />
      <CustomDivider />
      <Footer
        id={talent.id}
        access={access}
        isAdmin={isAdmin}
        dailyRate={talent.priceDay}
        hourlyRate={talent.priceHour}
        inCart={talent.inCart}
        addTalentInCart={addTalentInCart}
        deleteTalent={deleteTalent}
      />
    </div>
  )
}
