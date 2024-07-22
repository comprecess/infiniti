import { FC } from 'react'

import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { Item } from './Item/Item'
import styles from './SummaryPage.module.scss'

export const SummaryPage: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        <Item title='Company Name:' description={''} />
        <Item title='URL:' description={''} />
        <Item title='Email:' description={''} />
        <Item title='Phone:' description={''} />
      </div>
      <ButtonBlue title='Edit' style={styles.buttonBlue} />
    </div>
  )
}
