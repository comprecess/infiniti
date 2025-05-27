import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

import {
  AccountingAssetsInputData,
  AccountingNewAssetForm,
} from '../../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: AccountingAssetsInputData
  form: AccountingNewAssetForm
  setForm: Dispatch<SetStateAction<AccountingNewAssetForm | null>>
}

export const Fields = ({ inputData, form, setForm }: FieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setForm(prevFormData => {
      if (!prevFormData) return prevFormData

      return {
        ...prevFormData,
        [field]: value ?? '',
      }
    })
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Name'
        type='text'
        id='name'
        name='name'
        value={form.name}
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title='Date Purchased'
        titleOnChange='datePurchased'
        value={form.datePurchased}
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title='Supported until / Warranty'
        titleOnChange='supportedUntil'
        value={form.supportedUntil}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Price'
        type='number'
        id='price'
        name='price'
        value={form.price}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Serial'
        type='text'
        id='serial'
        name='serial'
        value={form.serial}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Category'
        titleOnChange='category'
        value={form.category}
        idList={inputData.category.map(item => item.id)}
        nameList={inputData.category.map(item => item.name)}
        onChange={handleChangeInput}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Note</span>
        <Textarea
          minHeight='140px'
          maxHeight='232px'
          color='gray.400'
          backgroundColor='brand.800'
          border='none'
          _hover={{ border: 'none' }}
          _focusVisible={{ border: 'none' }}
          _focusWithin={{ border: 'none' }}
          fontSize='16px'
          fontWeight='400'
          lineHeight='24px'
          value={form.notes}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeInput('notes', event.target.value)
          }
        />
      </div>
    </div>
  )
}
