import { FC } from 'react'

import { InfoIcon } from '../../../../shared/icons/InfoIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { TalentsLevel } from '../../../../shared/ui/TalentsLevel/TalentsLevel'
import { Item } from '../../../../widgets/TalentsCard/Footer/Item/Item'
import styles from './TalentCard.module.scss'

export const TalentCard: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarName}>
        <img src='/avatar.svg' alt='Avatar' className={styles.avatar} />
        <span className={styles.name}>Konstantin K.</span>
        <div className={styles.level}>
          <TalentsLevel title='Lead' />
        </div>
      </div>
      <div className={styles.available}>
        <InfoIcon fill={styles.infoIcon} />
        <span className={styles.availableText}>
          Will be available: next week
        </span>
      </div>
      <div className={styles.rates}>
        <Item title='520 €' description='Daily rate (8h)' />
        <Item title='80 €' description='Hourly rate' />
      </div>
      <ButtonBlue title='Add to order' />
      <div className={styles.taxes}>
        <img src='/icons/info.svg' alt='Info' />
        <span className={styles.taxesText}>Taxes included</span>
      </div>
      <ButtonBrand title='Show similar' />
    </div>
  )
}
