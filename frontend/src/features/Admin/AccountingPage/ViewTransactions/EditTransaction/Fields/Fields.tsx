import { Dispatch, SetStateAction } from 'react'

import {
  AccountingInputData,
  AccountingTransactionsForm,
} from '../../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../../shared/ui/TagSelector/TagSelector'
import styles from './Fields.module.scss'

interface FieldsProps {
  form: AccountingTransactionsForm
  inputData: AccountingInputData
  setForm: Dispatch<SetStateAction<AccountingTransactionsForm | null>>
}

export const Fields = ({ form, inputData, setForm }: FieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setForm(prevFormData => {
      if (!prevFormData) return prevFormData

      let newValue = value

      if (
        field === 'company' &&
        typeof value === 'number' &&
        value === 0
      ) {
        newValue = null
      } else if (
        field === 'staff' &&
        typeof value === 'number' &&
        value === 0
      ) {
        newValue = null
      }

      return {
        ...prevFormData,
        [field]: newValue,
      }
    })
  }

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        readOnly
        title='Account'
        titleOnChange='account'
        value={form.account}
        idList={inputData.account.map(item => item.id)}
        nameList={inputData.account.map(item => item.name)}
        onChange={() => {}}
      />
      <CustomDataPicker
        title='Date'
        titleOnChange='date'
        value={form.date}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Description'
        type='text'
        id='description'
        name='description'
        value={form.description}
        onChange={handleChangeInput}
      />
      <CustomInput
        readOnly
        title='Amount'
        type='text'
        id='amount'
        name='amount'
        value={form.amount}
        onChange={() => {}}
      />
      <CustomSelect
        title='Category'
        titleOnChange='category'
        value={form.category}
        idList={inputData.category.map(item => item.id)}
        nameList={inputData.category.map(item => item.name)}
        onChange={handleChangeInput}
      />
      <TagSelector
        title='Tags'
        list={inputData.tags.map(item => item.name)}
        selectedTags={form.tags}
        onTagsChange={tags => handleChangeInput('tags', tags)}
      />
      <CustomSelect
        title='Company'
        titleOnChange='company'
        placeholder='Not Selected'
        value={form.company ? form.company : undefined}
        idList={inputData.company.map(item => item.id)}
        nameList={inputData.company.map(item => item.name)}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Payee'
        titleOnChange='client'
        value={form.client}
        idList={inputData.client.map(item => item.id)}
        nameList={inputData.client.map(item => item.account)}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Staff'
        titleOnChange='staff'
        placeholder='Not Selected'
        value={form.staff}
        idList={inputData.staff.map(item => item.id)}
        nameList={inputData.staff.map(item => item.account)}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Method'
        titleOnChange='payMethods'
        value={form.payMethods}
        idList={inputData.payMethods.map(item => item.id)}
        nameList={inputData.payMethods.map(item => item.name)}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Ref'
        type='text'
        id='referralLink'
        name='referralLink'
        value={form.referralLink}
        onChange={handleChangeInput}
      />
    </div>
  )
}
