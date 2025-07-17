import { Dispatch, SetStateAction } from 'react'

import {
  AccountingBillsForm,
  AccountingInputData,
} from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: AccountingInputData
  form: AccountingBillsForm
  setForm: Dispatch<SetStateAction<AccountingBillsForm | null>>
  editBill: () => void
}

export const Fields = ({
  inputData,
  form,
  setForm,
  editBill,
}: FieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setForm(prevFormData => {
      if (!prevFormData) return prevFormData

      let newValue = value

      if (field === 'amount' && typeof value === 'string') {
        newValue = parseFloat(value).toFixed(2)
      } else if (field === 'recurringType' && typeof value === 'number') {
        newValue = inputData.recurringType[value]
      }

      return {
        ...prevFormData,
        [field]: newValue ?? '',
      }
    })
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Title'
        type='text'
        id='title'
        name='title'
        value={form.title}
        onInputChange={false}
        onChange={handleChangeInput}
      />
      <div className={styles.containerRowFour}>
        <CustomDataPicker
          title='Next Due Date'
          titleOnChange='nextDate'
          value={form.nextDate}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Repeat Every'
          titleOnChange='recurringType'
          idList={inputData.recurringType.map((_item, index) => index)}
          nameList={inputData.recurringType.map(item => item)}
          value={inputData.recurringType.findIndex(
            item => item === form.recurringType,
          )}
          onInputChange={false}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Currency'
          titleOnChange='currency'
          value={form.currency}
          idList={inputData.currency.map(currency => currency.id)}
          nameList={inputData.currency.map(currency => currency.code)}
          onInputChange={false}
          onChange={handleChangeInput}
        />
        <CustomInput
          title='Amount'
          type='number'
          id='amount'
          name='amount'
          value={form.amount}
          onChange={handleChangeInput}
        />
      </div>
      <div className={styles.containerRow}>
        <CustomSelect
          title='From Account'
          titleOnChange='account'
          value={form.account}
          idList={inputData.account.map(item => item.id)}
          nameList={inputData.account.map(item => item.name)}
          onInputChange={false}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Payee'
          titleOnChange='client'
          value={form.client}
          idList={inputData.client.map(item => item.id)}
          nameList={inputData.client.map(item => item.account)}
          onInputChange={false}
          onChange={handleChangeInput}
        />
      </div>
      <CustomSelect
        title='Category'
        titleOnChange='category'
        value={form.category}
        idList={inputData.category.map(currency => currency.id)}
        nameList={inputData.category.map(currency => currency.name)}
        onInputChange={false}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Website'
        type='text'
        id='website'
        name='website'
        value={form.website ? form.website : ''}
        onChange={handleChangeInput}
      />
      <ButtonBlue
        title='Save'
        style={styles.buttonSave}
        onClick={editBill}
      />
    </div>
  )
}
