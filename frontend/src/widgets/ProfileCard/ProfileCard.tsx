import { FC } from 'react'

import { UserInfo } from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { InfoItem } from './InfoItem/InfoItem'
import styles from './ProfileCard.module.scss'

interface ProfileCardProps {
  talent: UserInfo
}

export const ProfileCard: FC<ProfileCardProps> = ({ talent }) => {
  return (
    <div className={styles.wrapper}>
      <img
        src={talent.img ? talent.img : '/profileWithoutAvatar.svg'}
        alt='Avatar'
        className={styles.avatar}
      />
      <h3 className={styles.name}>{talent.account}</h3>
      <div className={styles.info}>
        <InfoItem
          title='Phone:'
          description={talent.phone ? talent.phone : 'Not Indicated'}
        />
        <InfoItem
          title='Email:'
          description={talent.email ? talent.email : 'Not Indicated'}
        />
        <InfoItem
          title='Business Number:'
          description={
            talent.businessNumber ? talent.businessNumber : 'Not Indicated'
          }
        />
      </div>
      <div className={styles.address}>
        <InfoItem
          title='Company Name:'
          description={talent.company ? talent.company : 'Not Indicated'}
        />
        <InfoItem
          title='Address:'
          description={talent.address ? talent.address : 'Not Indicated'}
        />
        <InfoItem
          title='City:'
          description={talent.city ? talent.city : 'Not Indicated'}
        />
        <InfoItem
          title='State/Region:'
          description={`${
            talent.state ? talent.state : 'Not Indicate'
          } — ${talent.zip ? talent.zip : 'Not Indicate'}`}
        />
      </div>
      <div className={styles.uploadPicture}>
        <ButtonBlue title='Upload picture' />
      </div>
    </div>
  )
}
