import { FC, useRef } from 'react'

import { UserInfo } from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../shared/ui/CustomToast/CustomToast'
import { updateProfileAvatar } from '../../shared/utils/api/Profile/UpdateProfileAvatar'
import { cropImageToSquare } from '../../shared/utils/Avatar/CropImage'
import { InfoItem } from './InfoItem/InfoItem'
import styles from './ProfileCard.module.scss'

interface ProfileCardProps {
  talent: UserInfo
  onChangeInfo: () => void
}

export const ProfileCard: FC<ProfileCardProps> = ({
  talent,
  onChangeInfo,
}) => {
  const showToast = useCustomToast()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files

    if (files && files.length > 0) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png'].includes(files[0].type)
      ) {
        showToast({
          title: 'Invalid file type',
          description: 'Only JPEG and PNG images are allowed',
          status: 'error',
        })

        return
      }

      const croppedFile = await cropImageToSquare(files[0])

      const formData = new FormData()
      formData.append('file', croppedFile)

      const updateResponse = await updateProfileAvatar(formData)

      if (updateResponse) {
        onChangeInfo()

        showToast({
          title: 'Uploaded',
          description: 'Your photo has been successfully uploaded',
          status: 'success',
        })
      } else {
        showToast({
          title: 'Not loaded',
          description: 'Your photo has not been uploaded',
          status: 'error',
        })
      }
    } else {
      showToast({
        title: 'Not loaded',
        description: 'Your photo has not been uploaded',
        status: 'error',
      })
    }
  }

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
        <ButtonBlue title='Upload picture' onClick={handleButtonClick} />
        <input
          ref={inputRef}
          type='file'
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  )
}
