import { FC, useEffect, useState } from 'react'

import { SettingsUserInputData } from '../../../../../../app/constants/constants'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomRadio } from '../../../../../../shared/ui/CustomRadio/CustomRadio'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: SettingsUserInputData
  onFormDataChange: (data: PartialFieldsNewUserData | null) => void
}

export interface PartialFieldsNewUserData {
  [key: string]: string | number | boolean | undefined | null
}

export const Fields: FC<FieldsProps> = ({ inputData, onFormDataChange }) => {
  const [formData, setFormData] = useState<PartialFieldsNewUserData | null>({
    role: inputData.role[0].id,
  })

  const handleChangeInput = (
    field: string,
    value: string | number | boolean | undefined | null,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[field]
      } else if (field === 'role') {
        updatedFormData[field] = inputData.role.find(
          role => role.name === value,
        )?.id
      } else {
        updatedFormData[field] = value
      }

      return updatedFormData
    })
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
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Full Name'
        type='text'
        id='fullName'
        name='fullName'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Phone'
        type='text'
        id='phoneNumber'
        name='phoneNumber'
        onChange={handleChangeInput}
      />
      <div className={styles.userTypeContainer}>
        <span className={styles.userTypeTitle}>Type</span>
        <CustomRadio
          direction='column'
          defaultValue={inputData.role[0].name}
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
    </div>
  )
}
