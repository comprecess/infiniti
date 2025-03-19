import { TalentInputDataBusinessPlan } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { TrashIcon } from '../../../../../../../shared/icons/TrashIcon'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Icon } from '../../../../../../../shared/ui/Icon/Icon'
import { TalentsLevel } from '../../../../../../../shared/ui/TalentsLevel/TalentsLevel'
import styles from './PeopleCard.module.scss'
import { Price } from './Price/Price'
import { Skills } from './Skills/Skills'

interface PeopleCardProps {
  talent: TalentInputDataBusinessPlan | undefined
  isRemove?: boolean
  deleteTalent: (id: number) => void
}

export const PeopleCard = ({
  talent,
  isRemove = false,
  deleteTalent,
}: PeopleCardProps) => {
  if (!talent) {
    return null
  }

  const lvl =
    talent.property
      .map(item =>
        item.lvl?.[0]?.value != null ? item.lvl[0].value : undefined,
      )
      .find(value => value !== undefined) || ''
  const industries = talent.property
    .flatMap(spec => spec.industries?.map(val => val) || [])
    .slice(0, 2)
  const keySkills = talent.property
    .flatMap(spec => spec.keySkills?.map(val => val) || [])
    .slice(0, 2)

  const navigateToViewTalent = () => {
    const url = `/${Routes.adminPages}/${Routes.talents}/${Routes.view}/${Routes.talent}/${talent.id}`

    window.open(url, '_blank')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.level}>
        <TalentsLevel title={lvl} />
      </div>
      <div className={styles.header} onClick={navigateToViewTalent}>
        <img
          alt='Avatar'
          className={styles.avatar}
          src={
            talent.img !== ''
              ? `${talent.img}?width=176&height=176`
              : '/profileWithoutAvatar.svg'
          }
        />
        <span className={styles.name}>{talent.name}</span>
        <span className={styles.specialization}>
          {talent.specialization}
        </span>
      </div>
      <CustomDivider />
      <div className={styles.body}>
        <Skills title='Industries' tags={industries} />
        <Skills title='Key Skills' tags={keySkills} />
      </div>
      <CustomDivider />
      <div className={styles.footer}>
        <Price title={talent.priceDay} description='Daily rate (8h)' />
        <Price title={talent.priceHour} description='Hourly rate' />
      </div>
      {isRemove && (
        <div
          className={styles.buttonRemove}
          onClick={() => deleteTalent(talent.id)}
        >
          <Icon
            hover={false}
            icon={<TrashIcon style={styles.icon} />}
            style={styles.wrapperIcon}
          />
        </div>
      )}
    </div>
  )
}
