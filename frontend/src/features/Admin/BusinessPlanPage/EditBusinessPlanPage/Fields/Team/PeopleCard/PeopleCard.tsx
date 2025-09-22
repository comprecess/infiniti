import styles from './PeopleCard.module.scss'
import { Price } from './Price/Price'
import { Skills } from './Skills/Skills'
import { TalentInputDataBusinessPlan } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { PlusIcon } from '../../../../../../../shared/icons/PlusIcon'
import { TrashIcon } from '../../../../../../../shared/icons/TrashIcon'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Icon } from '../../../../../../../shared/ui/Icon/Icon'
import { TalentsLevel } from '../../../../../../../shared/ui/TalentsLevel/TalentsLevel'

interface PeopleCardProps {
  talent: TalentInputDataBusinessPlan | undefined
  isRemove?: boolean
  isAdd?: boolean
  addTalent?: (id: number) => void
  deleteTalent?: (id: number) => void
}

export const PeopleCard = ({
  talent,
  isRemove = false,
  isAdd = false,
  addTalent,
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
          onClick={deleteTalent ? () => deleteTalent(talent.id) : () => {}}
        >
          <Icon
            hover={false}
            icon={<TrashIcon style={styles.iconTrash} />}
            style={styles.wrapperIconTrash}
          />
        </div>
      )}
      {isAdd && (
        <div
          className={styles.buttonAdd}
          onClick={addTalent ? () => addTalent(talent.id) : () => {}}
        >
          <Icon
            hover={false}
            icon={<PlusIcon style={styles.iconPlus} />}
            style={styles.wrapperIconPlus}
          />
        </div>
      )}
    </div>
  )
}
