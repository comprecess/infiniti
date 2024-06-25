import { FC } from 'react'

import { UserInfo } from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../shared/ui/CustomInput/CustomInput'
import { RecentCard } from '../RecentCard/RecentCard'
import { CountryList } from './CountryList/CountryList'
import styles from './ProfileChangeInfoCard.module.scss'

interface ProfileChangeInfoCardProps {
  talent: UserInfo
}

export const ProfileChangeInfoCard: FC<ProfileChangeInfoCardProps> = ({
  talent,
}) => {
  return (
    <div className={styles.wrapper}>
      <RecentCard title={'Edit Profile'}>
        <div className={styles.container}>
          <div className={styles.inputs}>
            <CustomInput
              id='name'
              title='Account Name'
              value={talent.account}
              type='text'
              name='name'
            />
            <CustomInput
              id='account'
              title='Company Name'
              value={talent.company}
              type='text'
              name='account'
            />
            <CustomInput
              id='email'
              title='Email'
              value={talent.email}
              type='email'
              name='email'
            />
            <CustomInput
              id='phone'
              title='Phone'
              value={talent.phone}
              type='tel'
              name='phone'
            />
            <CustomInput
              id='businessPhone'
              title='Business Number'
              value={talent.businessNumber}
              type='tel'
              name='phone'
            />
            <CustomInput
              id='address'
              title='Address'
              value={talent.address}
              type='text'
              name='address'
            />
            <CustomInput
              id='city'
              title='City'
              value={talent.city}
              type='text'
              name='city'
            />
            <CustomInput
              id='stateRegion'
              title='State/Region'
              value={talent.state}
              type='text'
              name='state'
            />
            <CustomInput
              id='zip'
              title='ZIP/Postal Code'
              value={talent.zip}
              type='text'
              name='zip'
            />
            <CountryList country={talent.country} />
            <div className={styles.inputDescription}>
              <CustomInput
                id='password'
                title='Password'
                type='password'
                name='password'
              />
              <span className={styles.description}>
                Keep Blank to do not change Password
              </span>
            </div>
          </div>
          <div className={styles.buttonSubmit}>
            <ButtonBlue title='Submit' />
          </div>
        </div>
      </RecentCard>
    </div>
  )
}
