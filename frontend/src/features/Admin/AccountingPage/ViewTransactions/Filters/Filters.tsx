import { Dispatch, SetStateAction } from 'react'

import styles from './Filters.module.scss'
import { AccountingInputData } from '../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'

interface FiltersProps {
  inputData: AccountingInputData
  setFilterType: Dispatch<SetStateAction<string>>
  setFilterAccount: Dispatch<SetStateAction<string>>
  setFilterContact: Dispatch<SetStateAction<string>>
  setFilterCategory: Dispatch<SetStateAction<string>>
  setFilterDateFrom: Dispatch<SetStateAction<string>>
  setFilterDateTo: Dispatch<SetStateAction<string>>
}

export const Filters = ({
  inputData,
  setFilterType,
  setFilterAccount,
  setFilterContact,
  setFilterCategory,
  setFilterDateFrom,
  setFilterDateTo,
}: FiltersProps) => {
  const handleChangeFilters = (name: string, value: string | number) => {
    if (name === 'filterType' && typeof value === 'number') {
      if (value > 0) {
        value = inputData.transactionTypes[value - 1]
        setFilterType(value as string)
      } else {
        setFilterType('')
      }
    } else if (name === 'account' && typeof value === 'number') {
      if (value > 0) {
        setFilterAccount(value.toString())
      } else {
        setFilterAccount('')
      }
    } else if (name === 'contact' && typeof value === 'number') {
      if (value > 0) {
        setFilterContact(value.toString())
      } else {
        setFilterContact('')
      }
    } else if (name === 'category' && typeof value === 'number') {
      if (value > 0) {
        setFilterCategory(value.toString())
      } else {
        setFilterCategory('')
      }
    } else if (name === 'filter[date][0]') {
      if (value !== '') {
        setFilterDateFrom(value as string)
      } else {
        setFilterDateFrom('')
      }
    } else if (name === 'filter[date][1]') {
      if (value !== '') {
        setFilterDateTo(value as string)
      } else {
        setFilterDateTo('')
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <CustomDataPicker
        title='From'
        titleOnChange='filter[date][0]'
        onChange={handleChangeFilters}
      />
      <CustomDataPicker
        title='To'
        titleOnChange='filter[date][1]'
        onChange={handleChangeFilters}
      />
      <CustomSelect
        title='Transaction Type'
        titleOnChange='filterType'
        placeholder='All'
        nameList={inputData.transactionTypes.map(item => item)}
        idList={inputData.transactionTypes.map(
          (_item, index) => index + 1,
        )}
        onChange={handleChangeFilters}
      />
      <CustomSelect
        title='Account'
        titleOnChange='account'
        placeholder='All'
        idList={inputData.account.map(item => item.id)}
        nameList={inputData.account.map(item => item.name)}
        onChange={handleChangeFilters}
      />
      <CustomSelect
        title='Contact'
        titleOnChange='contact'
        placeholder='All'
        idList={inputData.client.map(item => item.id)}
        nameList={inputData.client.map(item =>
          item.email ? `${item.account} - ${item.email}` : item.account,
        )}
        onChange={handleChangeFilters}
      />
      <CustomSelect
        title='Category'
        titleOnChange='category'
        placeholder='All'
        idList={inputData.category.map(item => item.id)}
        nameList={inputData.category.map(item => item.name)}
        onChange={handleChangeFilters}
      />
    </div>
  )
}
