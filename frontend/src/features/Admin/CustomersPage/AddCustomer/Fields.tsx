import { FC, useState } from 'react'

import { CustomerInputsData } from '../../../../app/constants/constants'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { CustomSwitch } from '../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { addNewCustomer } from '../../../../shared/utils/api/Admin/AddCustomer/AddNewCustomer'
import { CustomField } from './CustomField/CustomField'
import styles from './Fields.module.scss'

interface FieldsProps {
  data: CustomerInputsData
}

interface FieldsPostData {
  account: string
  code: string
  email: string
  phone: string
  password: string
  confirmationPassword: string
  secondaryEmail: string
  companyId: number
  currency: string
  groupId: number
  type: string[]
  country: string
  customFields: { [id: number]: string }
  displayName: string
  address: string
  userName: string
  city: string
  state: string
  welcomeEmail: number
  ownerId: number
  zip: string
}

export interface PartialFieldsPostData extends Partial<FieldsPostData> {
  [key: string]:
  | string
  | number
  | boolean
  | undefined
  | string[]
  | { [id: number]: string }
}

export const Fields: FC<FieldsProps> = ({ data }) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    code: data.code,
  })

  const showToast = useCustomToast()

  const onChangeInput = (
    name: string,
    value: string | string[] | number | boolean | null | undefined,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[name]
      } else if (name === 'ownerId') {
        const selectedOwner = data.owner.find(
          owner => owner.account === value,
        )
        updatedFormData[name] = selectedOwner?.id
      } else if (name === 'groupId') {
        const selectedGroup = data.group.find(
          group => group.name === value,
        )
        updatedFormData[name] = selectedGroup?.id
      } else if (name === 'companyId') {
        const selectedCompany = data.company.find(
          company => company.name === value,
        )
        updatedFormData[name] = selectedCompany?.id
      } else if (name === 'welcomeEmail') {
        if (value === true) {
          updatedFormData[name] = 1
        } else {
          updatedFormData[name] = 0
        }
      } else {
        updatedFormData[name] = value
      }

      return updatedFormData
    })
  }

  const OnChangeCheckBox = (name: string, isChecked: boolean) => {
    setFormData(prevFormData => {
      const updatedTypeArray = prevFormData.type
        ? [...prevFormData.type]
        : []

      if (isChecked) {
        if (!updatedTypeArray.includes(name)) {
          updatedTypeArray.push(name)
        }
      } else {
        const index = updatedTypeArray.indexOf(name)
        if (index > -1) {
          updatedTypeArray.splice(index, 1)
        }
      }

      onChangeInput('type', updatedTypeArray)

      return {
        ...prevFormData,
        type: updatedTypeArray,
      }
    })
  }

  const onChangeCustomFields = (name: string, value: string) => {
    setFormData(prevFormData => {
      const field = data.customFields.find(field => field.name === name)

      if (!field) {
        return prevFormData
      }

      const fieldId = field.id

      const updatedCustomFields = { ...prevFormData.customFields }

      if (value === '' || value === null || value === undefined) {
        delete updatedCustomFields[fieldId]
      } else {
        updatedCustomFields[fieldId] = value
      }

      return {
        ...prevFormData,
        customFields: updatedCustomFields,
      }
    })
  }

  const onChangeCountry = (_name: string, value: string) => {
    setFormData(prevFormData => {
      const countryKey = Object.entries(data.country).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_key, val]) => val === value,
      )?.[0]

      if (!countryKey) {
        return prevFormData
      }

      return {
        ...prevFormData,
        country: countryKey,
      }
    })
  }

  const addCustomer = async () => {
    const addResponse = await addNewCustomer(formData)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new user',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Full Name'
            type='text'
            id='account'
            name='account'
            onChange={onChangeInput}
          />
          <CustomInput
            title='Code'
            value={data.code}
            type='text'
            id='code'
            name='code'
            onChange={onChangeInput}
          />
          <CustomInput
            title='Display Name'
            type='text'
            id='displayName'
            name='displayName'
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Company'
            titleOnChange='companyId'
            placeholder='None'
            selectedList={data.company.map(item => item.name)}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Business Number'
            type='text'
            id='businessNumber'
            name='businessNumber'
            onChange={onChangeInput}
          />
          <div className={styles.containerTitle}>
            <span className={styles.title}>Type</span>
            {data.type.map(item => {
              return (
                <CustomCheckBox
                  key={item}
                  titleOnChange={item}
                  title={item.charAt(0).toUpperCase() + item.slice(1)}
                  onInputChange={OnChangeCheckBox}
                />
              )
            })}
          </div>
          <CustomInput
            title='Address'
            type='text'
            id='address'
            name='address'
            onChange={onChangeInput}
          />
          <CustomInput
            title='City'
            type='text'
            id='city'
            name='city'
            onChange={onChangeInput}
          />
          <CustomInput
            title='State/Region'
            type='text'
            id='state'
            name='state'
            onChange={onChangeInput}
          />
          <CustomInput
            title='ZIP/Postal Code'
            type='text'
            id='zip'
            name='zip'
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Country'
            selectedList={Object.values(data.country)}
            value='Russian Federation'
            onChange={onChangeCountry}
          />
          {data.customFields.map(item => {
            return (
              <CustomField
                key={item.id}
                input={item}
                onChange={onChangeCustomFields}
              />
            )
          })}
        </section>
        <section className={styles.section}>
          <CustomInput
            title='Email'
            type='text'
            id='email'
            name='email'
            onChange={onChangeInput}
          />
          <CustomInput
            title='Secondary Email'
            type='text'
            id='secondaryEmail'
            name='secondaryEmail'
            onChange={onChangeInput}
          />
          <div className={styles.containerTitle}>
            <span className={styles.title}>Welcome Email</span>
            <CustomSwitch
              titleOnChange='welcomeEmail'
              onChange={onChangeInput}
            />
          </div>
          <CustomInput
            title='Phone'
            type='text'
            id='phone'
            name='phone'
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            value='RUB'
            selectedList={data.currency.map(item => item.code)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Group'
            titleOnChange='groupId'
            placeholder='None'
            selectedList={data.group.map(item => item.name)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='ownerId'
            value={data.owner[0].account}
            selectedList={data.owner.map(item => item.account)}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Username'
            type='text'
            id='username'
            name='username'
            onChange={onChangeInput}
          />
          <CustomInput
            title='Password'
            type='password'
            id='password'
            name='password'
            onChange={onChangeInput}
          />
          <CustomInput
            title='Confirm Password'
            type='password'
            id='confirmationPassword'
            name='confirmationPassword'
            onChange={onChangeInput}
          />
        </section>
      </div>
      <ButtonBlue
        title='Add Contact'
        style={styles.buttonBlue}
        onClick={addCustomer}
      />
    </div>
  )
}
