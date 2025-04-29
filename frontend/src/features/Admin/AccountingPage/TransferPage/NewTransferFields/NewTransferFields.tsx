import { Dispatch, SetStateAction } from 'react'

import {
  AccountingInputData,
  AccountingTransferForm,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import styles from './NewTransferFields.module.scss'

interface AddDepositFieldsProps {
  inputData: AccountingInputData
  setForm: Dispatch<SetStateAction<Partial<AccountingTransferForm>>>
  addNewTransfer: () => void
}

export const NewTransferFields = ({
  inputData,
  setForm,
  addNewTransfer,
}: AddDepositFieldsProps) => {
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
          title='From'
          titleOnChange='fromAccount'
          value={inputData.account[0].id}
          idList={inputData.account.map(item => item.id)}
          nameList={inputData.account.map(item => item.name)}
          onChange={handleChangeInput}
        />
        <CustomSelect
          title='To'
          titleOnChange='toAccount'
          value={inputData.account[0].id}
          idList={inputData.account.map(item => item.id)}
          nameList={inputData.account.map(item => item.name)}
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
        <TagSelector
          title='Tags'
          list={inputData.tags.map(item => item.name)}
          selectedTags={[]}
          onTagsChange={tags => handleChangeInput('tags', tags)}
        />
        <CustomSelect
          title='Method'
          titleOnChange='payMethods'
          value={inputData.payMethods[0].id}
          idList={inputData.payMethods.map(item => item.id)}
          nameList={inputData.payMethods.map(item => item.name)}
          onChange={handleChangeInput}
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
          onClick={addNewTransfer}
        />
      </section>
    </div>
  )
}
