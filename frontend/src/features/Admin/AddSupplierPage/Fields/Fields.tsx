import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CustomerInputsData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { CustomSwitch } from '../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { postCreateNewCustomer } from '../../../../shared/utils/api/Admin/AddCustomer/post-create-new-customer'
import { CustomField } from '../../CustomersPage/AddCustomer/CustomField/CustomField'
import styles from './Fields.module.scss'

interface FieldsProps {
  data: CustomerInputsData
}

interface FieldsPostData {
  code: string
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

export const Fields = ({ data }: FieldsProps) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    code: data.code,
    type: Array(data.type[1]),
  })

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const onChangeInput = (
    name: string,
    value: string | string[] | number | boolean | null | undefined,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[name]
      } else if (name === 'welcomeEmail') {
        if (value === true) {
          updatedFormData[name] = 1
        } else {
          updatedFormData[name] = 0
        }
      } else if (name === 'currency' && typeof value === 'number') {
        updatedFormData[name] = data.currency?.find(
          currency => currency.id === value,
        )?.code
      } else if (name === 'groupId' && typeof value === 'number') {
        if (value === 0) {
          updatedFormData[name] = null
        } else {
          updatedFormData[name] = data.group[value - 1].id
        }
      } else if (name === 'companyId' && typeof value === 'number') {
        if (value === 0) {
          updatedFormData[name] = null
        } else {
          updatedFormData[name] = data.company[value - 1].id
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
      const valuesArray = Object.values(data.country)

      const countryValue = valuesArray[value]

      const countryKey = Object.entries(data.country).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_key, val]) => val === countryValue,
      )?.[0]

      return {
        ...prevFormData,
        country: countryKey,
      }
    })
  }

  const addSupplier = async () => {
    const addResponse = await postCreateNewCustomer(formData)

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new Supplier',
        status: 'success',
      })
      navigate(
        `/${Routes.adminPages}/${Routes.suppliers}/${Routes.list}/${Routes.suppliers}`,
      )
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
            idList={data.company.map((_item, index) => index + 1)}
            nameList={data.company.map(item => item.name)}
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
            {data.type.map((item, index) => {
              return (
                <CustomCheckBox
                  key={item}
                  defaultChecked={index === 1}
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
            nameList={Object.values(data.country)}
            value={Object.values(data.country).findIndex(
              value => value === 'Russian Federation',
            )}
            idList={Object.values(data.country).map(
              (_country, index) => index,
            )}
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
            idList={data.currency.map(item => item.id)}
            nameList={data.currency.map(item => item.code)}
            value={
              data.currency.find(currency => currency.isdefault === 1)?.id
            }
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Group'
            titleOnChange='groupId'
            placeholder='None'
            idList={data.group.map((_item, index) => index + 1)}
            nameList={data.group.map(item => item.name)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='ownerId'
            value={data.owner[0].id}
            idList={data.owner.map(item => item.id)}
            nameList={data.owner.map(item => item.account)}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Username'
            type='text'
            id='userName'
            name='userName'
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
        onClick={addSupplier}
      />
    </div>
  )
}
