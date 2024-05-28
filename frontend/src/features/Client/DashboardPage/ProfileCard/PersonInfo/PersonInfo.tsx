import { FC } from 'react'

import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Item } from './Item/Item'
import styles from './PersonInfo.module.scss'

interface PersonInfoProps {
  personalNumber: string
  email: string
  businessNumber: string
  company: string
  city: string
  zipCode: string
  stateRegion: string
  country: string
}

export const PersonInfo: FC<PersonInfoProps> = ({
  personalNumber,
  email,
  businessNumber,
  company,
  city,
  zipCode,
  stateRegion,
  country,
}) => {
  const notSpecified = 'Not Indicated'

  return (
    <div className={styles.wrapper}>
      <Item
        title='Person Number'
        info={personalNumber ? personalNumber : notSpecified}
      />
      <Item title='E-mail' info={email} />
      <div className={styles.dividerWrapper}>
        <CustomDivider />
      </div>
      <Item
        title='Business Number'
        info={businessNumber ? businessNumber : notSpecified}
      />
      <Item title='Company' info={company ? company : notSpecified} />
      <Item title='City' info={city ? city : notSpecified} />
      <Item title='Zip Code' info={zipCode ? zipCode : notSpecified} />
      <Item
        title='State/Region'
        info={stateRegion ? stateRegion : notSpecified}
      />
      <Item title='Country' info={country ? country : notSpecified} />
    </div>
  )
}
