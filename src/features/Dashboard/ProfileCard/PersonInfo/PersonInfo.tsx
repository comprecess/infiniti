import { Divider } from '@mui/material'
import { FC } from 'react'

import { ProfileInfo } from '../../../../app/data/profile'
import { Item } from './Item/Item'
import styles from './PersonInfo.module.scss'

export const PersonInfo: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Item title='Person Number' info={ProfileInfo.personalNumber} />
      <Item title='E-mail' info={ProfileInfo.email} />
      <div className={styles.dividerWrapper}>
        <Divider className={styles.divider} />
      </div>
      <Item title='Business Number' info={ProfileInfo.businessNumber} />
      <Item title='Company' info={ProfileInfo.company} />
      <Item title='City' info={ProfileInfo.city} />
      <Item title='Zip Code' info={ProfileInfo.zipCode} />
      <Item title='State/Region' info={ProfileInfo.stateRegion} />
      <Item title='Country' info={ProfileInfo.country} />
    </div>
  )
}
