import { Dispatch, SetStateAction } from 'react'

import styles from './AddABillPage.module.scss'
import { AccountingBillsForm, AccountingInputData } from '../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'

interface AddABillPageProps {
  inputData: AccountingInputData
  setForm: Dispatch<SetStateAction<Partial<AccountingBillsForm>>>
  addNewBill: () => void
}

export const AddABillPage = ({ inputData, setForm, addNewBill }: AddABillPageProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    if (field === 'amount' && typeof value === 'string') {
      value = parseInt(value).toFixed(2)
    } else if (field === 'recurringType' && typeof value === 'number') {
      value = inputData.recurringType[value]
    }

    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Title'
        type='text'
        id='title'
        name='title'
        onChange={handleChangeInput}
      />
      <div className={styles.containerRowFour}>
        <CustomDataPicker
          title='Next Due Date'
          titleOnChange='nextDate'
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Repeat Every'
          titleOnChange='recurringType'
          value={0}
          idList={inputData.recurringType.map((_item, index) => index)}
          nameList={inputData.recurringType.map(item => item)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Currency'
          titleOnChange='currency'
          value={inputData.currency[0].id}
          idList={inputData.currency.map(currency => currency.id)}
          nameList={inputData.currency.map(currency => currency.code)}
          onChange={handleChangeInput}
        />
        <CustomInput
          title='Amount'
          type='number'
          id='amount'
          name='amount'
          onChange={handleChangeInput}
        />
      </div>
      <div className={styles.containerRow}>
        <CustomSelect
          title='From Account'
          titleOnChange='account'
          value={inputData.account[0].id}
          idList={inputData.account.map(item => item.id)}
          nameList={inputData.account.map(item => item.name)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Payee'
          titleOnChange='client'
          value={inputData.client[0].id}
          idList={inputData.client.map(item => item.id)}
          nameList={inputData.client.map(item => item.account)}
          onChange={handleChangeInput}
        />
      </div>
      <CustomSelect
        title='Category'
        titleOnChange='category'
        value={inputData.category[0].id}
        idList={inputData.category.map(currency => currency.id)}
        nameList={inputData.category.map(currency => currency.name)}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Website'
        type='text'
        id='website'
        name='website'
        onChange={handleChangeInput}
      />
      <ButtonBlue title='Save' style={styles.buttonSave} onClick={addNewBill} />
    </div>
  )
}
