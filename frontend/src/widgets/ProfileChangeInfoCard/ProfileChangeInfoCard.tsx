import { useState } from 'react'

import {
  UpdateProfileInfoProps,
  UserInfo,
} from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../shared/ui/CustomInput/CustomInput'
import { useCustomToast } from '../../shared/ui/CustomToast/CustomToast'
import { updateProfileInfo } from '../../shared/utils/api/Client/Profile/UpdateProfileInfo'
import { RecentCard } from '../RecentCard/RecentCard'
import { CountryList } from './CountryList/CountryList'
import styles from './ProfileChangeInfoCard.module.scss'

interface ProfileChangeInfoCardProps {
  talent: UserInfo
  onChangeInfo: () => void
}

export const ProfileChangeInfoCard = ({
  talent,
  onChangeInfo,
}: ProfileChangeInfoCardProps) => {
  const [formData, setFormData] = useState<
  Partial<UpdateProfileInfoProps>
  >({
    account: talent.account,
    email: talent.email,
  })

  const showToast = useCustomToast()

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const hasAdditionalData = (data: Partial<UpdateProfileInfoProps>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, email, ...rest } = data

    return Object.values(rest).some(
      value => value !== undefined && value !== '',
    )
  }

  const isDataChanged = () => {
    return (
      formData.account !== talent.account ||
      formData.email !== talent.email ||
      hasAdditionalData(formData)
    )
  }

  const handleSendUpdateInfo = async () => {
    if (isDataChanged()) {
      const updateInfoResponse = await updateProfileInfo(formData)

      if (updateInfoResponse.status) {
        showToast({
          title: 'Successfully',
          description:
            'You have successfully updated your profile information',
          status: 'success',
        })
        onChangeInfo()
      } else {
        showToast({
          title: 'Error',
          description: updateInfoResponse.message,
          status: 'error',
        })
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <RecentCard title={'Edit Profile'}>
        <div className={styles.container}>
          <div className={styles.inputs}>
            <CustomInput
              id='account'
              title='Account Name'
              value={talent.account}
              type='text'
              name='name'
              onChange={handleInputChange}
            />
            <CustomInput
              id='company'
              title='Company Name'
              value={talent.company}
              type='text'
              name='account'
              onChange={handleInputChange}
            />
            <CustomInput
              id='email'
              title='Email'
              value={talent.email}
              type='email'
              name='email'
              onChange={handleInputChange}
            />
            <CustomInput
              id='phone'
              title='Phone'
              value={talent.phone}
              type='tel'
              name='phone'
              onChange={handleInputChange}
            />
            <CustomInput
              id='businessNumber'
              title='Business Number'
              value={talent.businessNumber}
              type='tel'
              name='phone'
              onChange={handleInputChange}
            />
            <CustomInput
              id='address'
              title='Address'
              value={talent.address}
              type='text'
              name='address'
              onChange={handleInputChange}
            />
            <CustomInput
              id='city'
              title='City'
              value={talent.city}
              type='text'
              name='city'
              onChange={handleInputChange}
            />
            <CustomInput
              id='state'
              title='State/Region'
              value={talent.state}
              type='text'
              name='state'
              onChange={handleInputChange}
            />
            <CustomInput
              id='zip'
              title='ZIP/Postal Code'
              value={talent.zip}
              type='text'
              name='zip'
              onChange={handleInputChange}
            />
            <CountryList
              country={talent.country}
              onChange={handleInputChange}
            />
            <div className={styles.inputDescription}>
              <CustomInput
                id='password'
                title='Password'
                type='password'
                name='password'
                onChange={handleInputChange}
              />
              <span className={styles.description}>
                Keep Blank to do not change Password
              </span>
            </div>
          </div>
          <div className={styles.buttonSubmit}>
            <ButtonBlue title='Submit' onClick={handleSendUpdateInfo} />
          </div>
        </div>
      </RecentCard>
    </div>
  )
}
