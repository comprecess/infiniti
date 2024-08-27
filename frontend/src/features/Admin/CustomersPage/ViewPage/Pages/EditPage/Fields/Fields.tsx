import { FC, useState } from 'react'

import {
  CustomerInputsData,
  ViewEditTypeData,
} from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../../shared/ui/CustomSelect/CustomSelect'
import { useCustomToast } from '../../../../../../../shared/ui/CustomToast/CustomToast'
import { TagSelector } from '../../../../../../../shared/ui/TagSelector/TagSelector'
import { updateProfileInfo } from '../../../../../../../shared/utils/api/Admin/ViewContact/Edit/UpdateProfileInfo'
import { CustomField } from '../../../../AddCustomer/CustomField/CustomField'
import styles from './Fields.module.scss'

interface FieldsProps {
  idClient: number
  data: ViewEditTypeData
  inputs: CustomerInputsData
}

interface FieldsPostData {
  type: string[]
  customFields: { [id: number]: string }
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

export const Fields: FC<FieldsProps> = ({ idClient, data, inputs }) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    type: data.type,
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
        const selectedOwner = inputs.owner.find(
          owner => owner.account === value,
        )
        updatedFormData[name] = selectedOwner?.id
      } else if (name === 'groupId') {
        const selectedGroup = inputs.group.find(
          group => group.name === value,
        )
        updatedFormData[name] = selectedGroup?.id
      } else if (name === 'companyId') {
        const selectedCompany = inputs.company.find(
          company => company.name === value,
        )
        updatedFormData[name] = selectedCompany?.id
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
      const countryKey = Object.entries(inputs.country).find(
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

  const onTagsChange = (tags: string[]) => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        tags,
      }
    })
  }

  const updateInfo = async () => {
    const updateResponse = await updateProfileInfo(idClient, formData)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed information',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
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
            value={data.account}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Business Number'
            type='text'
            id='businessNumber'
            name='businessNumber'
            value={data.businessNumber}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Address'
            type='text'
            id='address'
            name='address'
            value={data.address}
            onChange={onChangeInput}
          />
          <CustomInput
            title='City'
            type='text'
            id='city'
            name='city'
            value={data.city}
            onChange={onChangeInput}
          />
          <CustomInput
            title='State/Region'
            type='text'
            id='state'
            name='state'
            value={data.state}
            onChange={onChangeInput}
          />
          <CustomInput
            title='ZIP/Postal Code'
            type='text'
            id='zip'
            name='zip'
            value={data.zip}
            onChange={onChangeInput}
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
          <div className={styles.containerTypes}>
            <span className={styles.title}>Type</span>
            {inputs.type.map(item => {
              return (
                <CustomCheckBox
                  key={item}
                  titleOnChange={item}
                  defaultChecked={data.type.includes(item)}
                  title={item.charAt(0).toUpperCase() + item.slice(1)}
                  onInputChange={OnChangeCheckBox}
                />
              )
            })}
          </div>
          <TagSelector
            list={inputs.tags}
            selectedTags={data.tags}
            onTagsChange={onTagsChange}
          />
        </section>
        <section className={styles.section}>
          <CustomInput
            title='Display Name'
            type='text'
            id='displayName'
            name='displayName'
            value={data.displayName}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Username'
            type='text'
            id='userName'
            name='userName'
            value={data.userName}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Code'
            type='text'
            id='code'
            name='code'
            value={data.code}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Email'
            type='text'
            id='email'
            name='email'
            value={data.email}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Secondary Email'
            type='text'
            id='secondaryEmail'
            name='secondaryEmail'
            value={data.secondaryEmail}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Phone'
            type='text'
            id='phone'
            name='phone'
            value={data.phone}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Company'
            titleOnChange='companyId'
            placeholder='None'
            value={data.company?.name}
            selectedList={inputs.company.map(item => item.name)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Country'
            titleOnChange='countryId'
            selectedList={Object.values(inputs.country)}
            value={data.country}
            onChange={onChangeCountry}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            value={data.currency.code}
            selectedList={inputs.currency.map(item => item.code)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Group'
            titleOnChange='groupId'
            placeholder='None'
            value={data.group?.name}
            selectedList={inputs.group.map(item => item.name)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='ownerId'
            selectedList={inputs.owner.map(item => item.account)}
            value={
              inputs.owner.find(item => item.id === data.ownerId)?.account
            }
            onChange={onChangeInput}
          />
          <div className={styles.passwordContainer}>
            <CustomInput
              title='Password'
              type='password'
              id='password'
              name='password'
              onChange={onChangeInput}
            />
            <span className={styles.passwordDescription}>
              Keep Blank to do not change Password
            </span>
          </div>
        </section>
      </div>
      <ButtonBlue
        title='Submit'
        style={styles.buttonBlue}
        onClick={updateInfo}
      />
    </div>
  )
}
