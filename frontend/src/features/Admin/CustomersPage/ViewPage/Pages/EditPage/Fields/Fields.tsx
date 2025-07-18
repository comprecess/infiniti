import { useState } from 'react'

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
import { putUpdateProfileInfo } from '../../../../../../../shared/utils/api/Admin/ViewContact/Edit/put-update-profile-info'
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
  | null
}

export const Fields = ({ idClient, data, inputs }: FieldsProps) => {
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
      } else if (name === 'groupId' && typeof value === 'number') {
        if (value === 0) {
          updatedFormData[name] = null
        } else {
          updatedFormData[name] = inputs.group[value - 1].id
        }
      } else if (name === 'currency' && typeof value === 'number') {
        updatedFormData[name] = inputs.currency?.find(
          currency => currency.id === value,
        )?.code
      } else if (name === 'companyId' && typeof value === 'number') {
        if (value === 0) {
          updatedFormData[name] = null
        } else {
          updatedFormData[name] = inputs.company[value - 1].id
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

  const onChangeCountry = (_name: string, value: number) => {
    setFormData(prevFormData => {
      const valuesArray = Object.values(inputs.country)

      const countryValue = valuesArray[value]

      const countryKey = Object.entries(inputs.country).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_key, val]) => val === countryValue,
      )?.[0]

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
    const updateResponse = await putUpdateProfileInfo(idClient, formData)

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
                  title={item}
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
            idList={inputs.company?.map((_item, index) => index + 1)}
            nameList={inputs.company?.map(item => item.name)}
            value={
              inputs.company?.findIndex(
                value => value.id === data.company?.id,
              ) + 1
            }
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Country'
            nameList={Object.values(inputs.country)}
            value={Object.values(inputs.country).findIndex(
              value => value === data.country,
            )}
            idList={Object.values(inputs.country).map(
              (_country, index) => index,
            )}
            onChange={onChangeCountry}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            value={data.currency?.id}
            idList={inputs.currency?.map(item => item.id)}
            nameList={inputs.currency?.map(item => item.code)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Group'
            titleOnChange='groupId'
            placeholder='None'
            idList={inputs.group?.map((_item, index) => index + 1)}
            nameList={inputs.group?.map(item => item.name)}
            value={
              inputs.group?.findIndex(
                value => value.id === data.group?.id,
              ) + 1
            }
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='ownerId'
            idList={inputs.owner?.map(item => item.id)}
            nameList={inputs.owner?.map(item => item.account)}
            value={
              inputs.owner?.find(item => item.id === data.ownerId)?.id
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
