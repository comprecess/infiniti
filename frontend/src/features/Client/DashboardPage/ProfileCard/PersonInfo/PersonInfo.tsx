import { Item } from './Item/Item'
import styles from './PersonInfo.module.scss'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'

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

export const PersonInfo = ({
  personalNumber,
  email,
  businessNumber,
  company,
  city,
  zipCode,
  stateRegion,
  country,
}: PersonInfoProps) => {
  return (
    <div className={styles.wrapper}>
      <Item
        title='Person Number'
        info={personalNumber ? personalNumber : '-'}
      />
      <Item title='E-mail' info={email} />
      <div className={styles.dividerWrapper}>
        <CustomDivider />
      </div>
      <Item
        title='Business Number'
        info={businessNumber ? businessNumber : '-'}
      />
      <Item title='Company' info={company ? company : '-'} />
      <Item title='City' info={city ? city : '-'} />
      <Item title='Zip Code' info={zipCode ? zipCode : '-'} />
      <Item title='State/Region' info={stateRegion ? stateRegion : '-'} />
      <Item title='Country' info={country ? country : '-'} />
    </div>
  )
}
