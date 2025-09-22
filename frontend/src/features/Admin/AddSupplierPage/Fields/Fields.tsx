import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Fields.module.scss'
import { CustomerInputsData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { CustomSwitch } from '../../../../shared/ui/CustomSwitch/CustomSwitch'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { postCreateNewCustomer } from '../../../../shared/utils/api/Admin/AddCustomer/post-create-new-customer'
import { loadStorage } from '../../../../shared/utils/Saving/Storage/LoadStorage'
import { removeStorage } from '../../../../shared/utils/Saving/Storage/RemoveStorage'
import { saveStorage } from '../../../../shared/utils/Saving/Storage/SaveStorage'
import { CustomField } from '../../CustomersPage/AddCustomer/CustomField/CustomField'

interface FieldsProps {
  storageKey: string
  data: CustomerInputsData
}

interface FieldsPostData {
  account: string
  displayName: string
  code: string
  type: string[]
  address: string
  businessNumber: string
  city: string
  companyId: number | null
  state: string
  zip: string
  email: string
  secondaryEmail: string
  welcomeEmail: number
  phone: string
  currency: string
  groupId: number | null
  ownerId: number | null
  userName: string
  customFields: { [id: number]: string }
}

export interface PartialFieldsPostData extends Partial<FieldsPostData> {
  [key: string]: string | number | boolean | undefined | string[] | { [id: number]: string } | null
}

export const Fields = ({ data, storageKey }: FieldsProps) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>(() => {
    const savedData = loadStorage<PartialFieldsPostData>(storageKey)

    if (savedData) return savedData

    return {
      code: data.code,
      type: Array(data.type[1]),
      customFields: {},
    }
  })

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const saveAndUpdate = (updatedData: PartialFieldsPostData) => {
    setFormData(updatedData)
    saveStorage(storageKey, updatedData)
  }

  const onChangeInput = (
    name: string,
    value: string | string[] | number | boolean | null | undefined,
  ) => {
    const updatedFormData = { ...formData }

    if (value === '' || value === null || value === undefined) {
      delete updatedFormData[name]
    } else if (name === 'welcomeEmail') {
      updatedFormData[name] = value ? 1 : 0
    } else if (name === 'currency' && typeof value === 'number') {
      updatedFormData[name] = data.currency?.find(c => c.id === value)?.code
    } else if (name === 'groupId' && typeof value === 'number') {
      updatedFormData[name] = value === 0 ? null : value
    } else if (name === 'companyId' && typeof value === 'number') {
      updatedFormData[name] = value === 0 ? null : value
    } else {
      updatedFormData[name] = value
    }

    saveAndUpdate(updatedFormData)
  }

  const OnChangeCheckBox = (name: string, isChecked: boolean) => {
    const updatedTypeArray = formData.type ? [...formData.type] : []

    if (isChecked) {
      if (!updatedTypeArray.includes(name)) updatedTypeArray.push(name)
    } else {
      const index = updatedTypeArray.indexOf(name)

      if (index > -1) updatedTypeArray.splice(index, 1)
    }

    onChangeInput('type', updatedTypeArray)
  }

  const onChangeCustomFields = (name: string, value: string) => {
    const field = data.customFields.find(f => f.name === name)

    if (!field) return

    const updatedCustomFields = { ...(formData.customFields || {}) }

    if (!value) delete updatedCustomFields[field.id]
    else updatedCustomFields[field.id] = value

    saveAndUpdate({ ...formData, customFields: updatedCustomFields })
  }

  const onChangeCountry = (_name: string, value: number) => {
    const countryKey = Object.keys(data.country)[value]

    saveAndUpdate({ ...formData, country: countryKey })
  }

  const addSupplier = async () => {
    const { status, message } = await postCreateNewCustomer(formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created a new Supplier',
        status: 'success',
      })
      removeStorage(storageKey)
      navigate(`/${Routes.adminPages}/${Routes.suppliers}/${Routes.list}/${Routes.suppliers}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleNavigateToCreateCompany = () => {
    navigate(`/${Routes.adminPages}/${Routes.customers}/${Routes.companies}`)
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
            value={formData.account}
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
            title='Display Name'
            type='text'
            id='displayName'
            name='displayName'
            value={formData.displayName}
            onChange={onChangeInput}
          />
          <div className={styles.inputDescription}>
            <CustomSelect
              title='Company'
              titleOnChange='companyId'
              placeholder='Not Selected'
              value={formData.companyId ?? undefined}
              idList={data.company.map(item => item.id)}
              nameList={data.company.map(item => item.name)}
              onChange={onChangeInput}
            />
            <div>
              <span className={styles.description} onClick={handleNavigateToCreateCompany}>
                Click to create a new Company
              </span>
            </div>
          </div>
          <CustomInput
            title='Business Number'
            type='text'
            id='businessNumber'
            name='businessNumber'
            value={formData.businessNumber}
            onChange={onChangeInput}
          />
          <div className={styles.containerTitle}>
            <span className={styles.title}>Type</span>
            {data.type.map(item => {
              let typeArray: string[] = []

              if (formData.type && formData.type.length > 0) {
                typeArray = formData.type.includes(data.type[1])
                  ? formData.type
                  : [data.type[1], ...formData.type]
              } else {
                typeArray = [data.type[1]]
              }

              const isChecked = typeArray.includes(item)

              return (
                <CustomCheckBox
                  key={item}
                  isChecked={isChecked}
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
            value={formData.address}
            onChange={onChangeInput}
          />
          <CustomInput
            title='City'
            type='text'
            id='city'
            name='city'
            value={formData.city}
            onChange={onChangeInput}
          />
          <CustomInput
            title='State/Region'
            type='text'
            id='state'
            name='state'
            value={formData.state}
            onChange={onChangeInput}
          />
          <CustomInput
            title='ZIP/Postal Code'
            type='text'
            id='zip'
            name='zip'
            value={formData.zip}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Country'
            nameList={Object.values(data.country)}
            idList={Object.values(data.country).map((_country, index) => index)}
            value={
              formData.country
                ? Object.values(data.country).findIndex(
                  val => val === data.country[formData.country as keyof typeof data.country],
                )
                : Object.values(data.country).findIndex(val => val === 'Russian Federation')
            }
            onChange={onChangeCountry}
          />
          {data.customFields.map(item => {
            const currentValue = formData.customFields?.[item.id] ?? ''

            return (
              <CustomField
                key={item.id}
                input={{ ...item, value: currentValue }}
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
            value={formData.email}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Secondary Email'
            type='text'
            id='secondaryEmail'
            name='secondaryEmail'
            value={formData.secondaryEmail}
            onChange={onChangeInput}
          />
          <div className={styles.containerTitle}>
            <span className={styles.title}>Welcome Email</span>
            <CustomSwitch
              titleOnChange='welcomeEmail'
              isChecked={formData.welcomeEmail === 1 ? true : false}
              onChange={onChangeInput}
            />
          </div>
          <CustomInput
            title='Phone'
            type='text'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Currency'
            titleOnChange='currency'
            idList={data.currency.map(item => item.id)}
            nameList={data.currency.map(item => item.code)}
            value={
              formData.currency
                ? data.currency.find(c => c.code === formData.currency)?.id
                : data.currency.find(currency => currency.isdefault === 1)?.id
            }
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Group'
            titleOnChange='groupId'
            placeholder='None'
            value={formData.groupId ?? undefined}
            idList={data.group.map(item => item.id)}
            nameList={data.group.map(item => item.name)}
            onChange={onChangeInput}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='ownerId'
            value={formData.ownerId ?? data.owner[0].id}
            idList={data.owner.map(item => item.id)}
            nameList={data.owner.map(item => item.account)}
            onChange={onChangeInput}
          />
          <CustomInput
            title='Username'
            type='text'
            id='userName'
            name='userName'
            value={formData.userName}
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
      <ButtonBlue title='Add Contact' style={styles.buttonBlue} onClick={addSupplier} />
    </div>
  )
}
