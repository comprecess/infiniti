import { Dispatch, SetStateAction } from 'react'

import styles from './NewAccountFields.module.scss'
import {
  AccountingAccountsForm,
  AccountingAccountsInputData,
} from '../../../../../app/constants/constants'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'

interface NewAccountFieldsProps {
  inputData: AccountingAccountsInputData
  setForm: Dispatch<SetStateAction<Partial<AccountingAccountsForm>>>
}

export const NewAccountFields = ({
  inputData,
  setForm,
}: NewAccountFieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    if (field.startsWith('currency-')) {
      const currencyId = Number(field.split('-')[1])

      setForm(prevFormData => {
        const prevBalance = prevFormData.balance ?? []

        const updatedBalance: { amount: string; currency: number }[] = [
          ...prevBalance,
        ]

        const existingIndex = updatedBalance.findIndex(
          b => b.currency === currencyId,
        )

        if (existingIndex !== -1) {
          updatedBalance[existingIndex] = {
            ...updatedBalance[existingIndex],
            amount: value?.toString() ?? '',
          }
        } else {
          updatedBalance.push({
            currency: currencyId,
            amount: value?.toString() ?? '',
          })
        }

        return {
          ...prevFormData,
          balance: updatedBalance,
        }
      })
    } else {
      setForm(prevFormData => ({
        ...prevFormData,
        [field]: value,
      }))
    }
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Account Title'
        type='text'
        id='name'
        name='name'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Description'
        type='text'
        id='description'
        name='description'
        onChange={handleChangeInput}
      />
      {inputData.currency.map(item => (
        <CustomInput
          key={item.id}
          title={`Initial Balance [ ${item.code} ]`}
          type='number'
          id={`currency-${item.id}`}
          name={`currency-${item.id}`}
          onChange={handleChangeInput}
        />
      ))}
      <CustomInput
        title='Account Number'
        type='text'
        id='accountNumber'
        name='accountNumber'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Contact Person'
        type='text'
        id='contactPerson'
        name='contactPerson'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Phone'
        type='text'
        id='contactPhone'
        name='contactPhone'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Internet Banking URL'
        type='text'
        id='url'
        name='url'
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Owner'
        titleOnChange='owner'
        value={inputData.owner[0].id}
        idList={inputData.owner.map(item => item.id)}
        nameList={inputData.owner.map(item => item.account)}
        onChange={handleChangeInput}
      />
    </div>
  )
}
