import { Textarea } from '@chakra-ui/react'
import { FC, useEffect, useRef, useState } from 'react'

import {
  SettingsEditUserData,
  SettingsUserInputData,
} from '../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomRadio } from '../../../../../../shared/ui/CustomRadio/CustomRadio'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'
import { useCustomToast } from '../../../../../../shared/ui/CustomToast/CustomToast'
import { cropImageToSquare } from '../../../../../../shared/utils/Avatar/CropImage'
import styles from './Fields.module.scss'

interface FieldsProps {
  userInfo: SettingsEditUserData
  inputData: SettingsUserInputData
  onFormDataChange: (data: PartialFieldsEditUserData | null) => void
  updateUserAvatar: (file: FormData) => void
}

interface InfoData {
  email: string
  fullName: string
  phoneNumber: string
  language: string
  img: string
  role: number
  jobTitle: string
  address: string
  city: string
  state: string
  zip: string
  country: string | null
  dateHired: string
  payFrequency: string
  amount: string
  summary: string
}

export interface PartialFieldsEditUserData extends Partial<InfoData> {
  [key: string]: string | number | boolean | undefined | null
}

export const Fields: FC<FieldsProps> = ({
  userInfo,
  inputData,
  onFormDataChange,
  updateUserAvatar,
}) => {
  const [formData, setFormData] = useState<PartialFieldsEditUserData>({
    email: userInfo.email,
    fullName: userInfo.fullName,
    phoneNumber: userInfo.phoneNumber,
    language: userInfo.language,
    role: userInfo.role?.id,
    jobTitle: userInfo.jobTitle,
    address: userInfo.address,
    city: userInfo.city,
    state: userInfo.state,
    zip: userInfo.zip,
    country: userInfo.country,
    dateHired: userInfo.dateHired,
    payFrequency: userInfo.payFrequency,
    amount: userInfo.amount,
    summary: userInfo.summary,
  })

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
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(files[0].type)) {
        showToast({
          title: 'Error',
          description: 'Only JPEG and PNG images are allowed',
          status: 'error',
        })

        return
      }

      const croppedFile = await cropImageToSquare(files[0])

      const file = new FormData()
      file.append('file', croppedFile)

      updateUserAvatar(file)
    }
  }

  const handleChangeInput = (
    field: string,
    value: string | number | undefined | null,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[field]
      } else if (field === 'role') {
        updatedFormData[field] = inputData.role.find(
          role => role.name === value,
        )?.id
      } else if (field === 'language' && typeof value === 'number') {
        if (value === 0) {
          delete updatedFormData[field]
        } else {
          updatedFormData[field] = inputData.localization[value - 1].iso_code
        }
      } else if (field === 'payFrequency' && typeof value === 'number') {
        if (value === 0) {
          delete updatedFormData[field]
        } else {
          updatedFormData[field] = inputData.payFrequency[value - 1]
        }
      } else {
        updatedFormData[field] = value
      }

      return updatedFormData
    })
  }

  const onChangeCountry = (_name: string, value: number) => {
    setFormData((prevFormData): PartialFieldsEditUserData => {
      const valuesArray = Object.values(inputData.country)
      const countryValue = valuesArray[value - 1]

      let countryKey = null

      if (value === 0) {
        countryKey = null
      } else {
        countryKey = Object.entries(inputData.country).find(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_key, val]) => val === countryValue,
        )?.[0]
      }

      return {
        ...prevFormData,
        country: countryKey,
      }
    })
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    handleChangeInput('summary', event.target.value)
  }

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Email'
        type='text'
        id='email'
        name='email'
        value={formData.email}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Full Name'
        type='text'
        id='fullName'
        name='fullName'
        value={formData.fullName}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Phone'
        type='text'
        id='phoneNumber'
        name='phoneNumber'
        value={formData.phoneNumber}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Language'
        titleOnChange='language'
        placeholder='None'
        idList={inputData.localization.map((_language, index) => index + 1)}
        nameList={inputData.localization.map(language => language.name)}
        value={
          formData.language
            ? inputData.localization.findIndex(
                language => language.iso_code === formData.language,
              ) + 1
            : undefined
        }
        onChange={handleChangeInput}
      />
      <div className={styles.avatarContainer}>
        <img
          src={userInfo.img ? userInfo.img : '/profileWithoutAvatar.svg'}
          alt='Avatar'
          className={styles.avatar}
        />
        <div className={styles.buttonsContainer}>
          <div className={styles.uploadPicture}>
            <ButtonBlue title='Upload picture' onClick={handleButtonClick} />
            <input
              ref={inputRef}
              type='file'
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <ButtonBlue title='Remove picture' style={styles.buttonRemove} />
        </div>
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Type</span>
        <CustomRadio
          direction='column'
          defaultValue={userInfo.role.name}
          radioList={inputData.role.map(role => role.name)}
          onChange={value => handleChangeInput('role', value)}
        />
      </div>
      <CustomInput
        title='Password'
        type='password'
        id='password'
        name='password'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Confirm Password'
        type='password'
        id='confirmationPassword'
        name='confirmationPassword'
        onChange={handleChangeInput}
      />
      <div className={styles.divider}>
        <CustomDivider />
      </div>
      <CustomInput
        title='Job Title'
        type='text'
        id='jobTitle'
        name='jobTitle'
        value={formData.jobTitle}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Address'
        type='text'
        id='address'
        name='address'
        value={formData.address}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='City'
        type='text'
        id='city'
        name='city'
        value={formData.city}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='State/Region'
        type='text'
        id='state'
        name='state'
        value={formData.state}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='ZIP/Postal Code'
        type='text'
        id='zip'
        name='zip'
        value={formData.zip}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Country'
        titleOnChange='country'
        placeholder='None'
        nameList={Object.values(inputData.country)}
        value={
          Object.values(inputData.country).findIndex(
            country => country === formData.country,
          ) + 1
        }
        idList={Object.values(inputData.country).map(
          (_country, index) => index + 1,
        )}
        onChange={onChangeCountry}
      />
      <CustomDataPicker
        title='Date Joined'
        titleOnChange='dateHired'
        value={formData.dateHired}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Pay Frequency'
        titleOnChange='payFrequency'
        placeholder='None'
        idList={inputData.payFrequency.map((_pay, index) => index + 1)}
        nameList={inputData.payFrequency}
        value={
          inputData.payFrequency.findIndex(
            pay => pay === formData.payFrequency,
          ) + 1
        }
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Amount'
        type='text'
        id='amount'
        name='amount'
        value={formData.amount}
        onChange={handleChangeInput}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Summary</span>
        <Textarea
          minHeight='140px'
          maxHeight='232px'
          focusBorderColor='#1b1e29'
          borderColor='#1b1e29'
          color='gray.400'
          backgroundColor='brand.800'
          border='1px solid #1b1e29'
          _hover={{ borderColor: '#1b1e29' }}
          fontSize='16px'
          fontWeight='400'
          lineHeight='24px'
          value={formData.summary ? formData.summary : ''}
          onChange={handleTextAreaChange}
        />
      </div>
    </div>
  )
}
