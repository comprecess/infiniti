import { Dispatch, SetStateAction } from 'react'

import styles from './AddExpenseFields.module.scss'
import {
  AccountingDepositExpenseForm,
  AccountingInputData,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'

interface AddExpenseFieldsProps {
  inputData: AccountingInputData
  setForm: Dispatch<SetStateAction<Partial<AccountingDepositExpenseForm>>>
  addNewTransaction: () => void
}

export const AddExpenseFields = ({
  inputData,
  setForm,
  addNewTransaction,
}: AddExpenseFieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    if (field === 'amount' && typeof value === 'string') {
      value = parseInt(value).toFixed(2)
    }

    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <CustomSelect
          title='Account'
          titleOnChange='account'
          value={inputData.account[0].id}
          idList={inputData.account.map(item => item.id)}
          nameList={inputData.account.map(item => item.name)}
          onChange={handleChangeInput}
        />
        <CustomInput
          title='Code'
          type='text'
          id='code'
          name='code'
          value={inputData.code}
          onChange={handleChangeInput}
        />
        <CustomDataPicker
          title='Date'
          titleOnChange='date'
          onChange={handleChangeInput}
        />
        <CustomInput
          title='Description'
          type='text'
          id='description'
          name='description'
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
        <CustomSelect
          title='Category'
          titleOnChange='category'
          value={inputData.category[0].id}
          idList={inputData.category.map(currency => currency.id)}
          nameList={inputData.category.map(currency => currency.name)}
          onChange={handleChangeInput}
        />
        <TagSelector
          title='Tags'
          list={inputData.tags.map(item => item.name)}
          selectedTags={[]}
          onTagsChange={tags => handleChangeInput('tags', tags)}
        />
        <CustomSelect
          title='Company'
          titleOnChange='company'
          value={inputData.company[0].id}
          idList={inputData.company.map(item => item.id)}
          nameList={inputData.company.map(item => item.name)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Payer'
          titleOnChange='client'
          value={inputData.client[0].id}
          idList={inputData.client.map(item => item.id)}
          nameList={inputData.client.map(item => item.account)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Staff'
          titleOnChange='staff'
          value={inputData.staff[0].id}
          idList={inputData.staff.map(item => item.id)}
          nameList={inputData.staff.map(item => item.account)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Method'
          titleOnChange='payMethods'
          value={inputData.payMethods[0].id}
          idList={inputData.payMethods.map(item => item.id)}
          nameList={inputData.payMethods.map(item => item.name)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='Status'
          titleOnChange='status'
          value={0}
          idList={inputData.status.map((_item, index) => index)}
          nameList={inputData.status.map(item => item)}
          onChange={(name: string, value: number) =>
            handleChangeInput(name, inputData.status[value])
          }
        />
        <div className={styles.inputDescription}>
          <CustomInput
            title='Ref#'
            type='number'
            id='referralLink'
            name='referralLink'
            onChange={handleChangeInput}
          />
          <span className={styles.description}>
            e.g. Transaction ID, Check No.
          </span>
        </div>
        <ButtonBlue
          title='Submit'
          style={styles.buttonSubmit}
          onClick={addNewTransaction}
        />
      </section>
    </div>
  )
}
