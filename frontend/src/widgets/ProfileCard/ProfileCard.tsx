import { ChangeEvent, useRef } from 'react'

import { InfoItem } from './InfoItem/InfoItem'
import styles from './ProfileCard.module.scss'
import { UserInfo } from '../../app/constants/constants'
import { ButtonBlue } from '../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../shared/ui/CustomToast/CustomToast'
import { postUpdateProfileAvatar } from '../../shared/utils/api/Client/Profile/post-update-profile-avatar'
import { cropImageToSquare } from '../../shared/utils/Avatar/CropImage'

interface ProfileCardProps {
  talent: UserInfo
  onChangeInfo: () => void
}

export const ProfileCard = ({ talent, onChangeInfo }: ProfileCardProps) => {
  const showToast = useCustomToast()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length > 0) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(files[0].type)) {
        showToast({
          title: 'Error',
          description: 'Only JPEG and PNG images are allowed',
          status: 'error',
        })

        return
      }

      const croppedFile = await cropImageToSquare(files[0])
      const formData = new FormData()

      formData.append('file', croppedFile)

      const { status, message } = await postUpdateProfileAvatar(formData)

      if (status) {
        showToast({
          title: 'Successfully',
          description: 'Your photo has been successfully uploaded',
          status: 'success',
        })
        onChangeInfo()
      } else {
        showToast({
          title: 'Error',
          description: message,
          status: 'error',
        })
      }
    } else {
      showToast({
        title: 'Error',
        description: 'Your photo has not been uploaded',
        status: 'error',
      })
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <img
          alt='Avatar'
          src={talent.img ? `${talent.img}?width=128&height=128` : '/profileWithoutAvatar.svg'}
        />
      </div>
      <h3 className={styles.name}>{talent.account}</h3>
      <div className={styles.info}>
        <InfoItem title='Phone:' description={talent.phone ? talent.phone : '-'} />
        <InfoItem title='Email:' description={talent.email ? talent.email : '-'} />
        <InfoItem
          title='Business Number:'
          description={talent.businessNumber ? talent.businessNumber : '-'}
        />
      </div>
      <div className={styles.address}>
        <InfoItem title='Company Name:' description={talent.company ? talent.company : '-'} />
        <InfoItem title='Address:' description={talent.address ? talent.address : '-'} />
        <InfoItem title='City:' description={talent.city ? talent.city : '-'} />
        <InfoItem
          title='State/Region:'
          description={`${talent.state ? talent.state : 'Not Indicate'} — ${
            talent.zip ? talent.zip : 'Not Indicate'
          }`}
        />
      </div>
      <div className={styles.uploadPicture}>
        <ButtonBlue title='Upload picture' style={styles.button} onClick={handleButtonClick} />
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
