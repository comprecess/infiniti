import { Textarea } from '@chakra-ui/react'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

import styles from './Fields.module.scss'
import {
  AccountingAssetsInputData,
  AccountingNewAssetForm,
} from '../../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'

interface FieldsProps {
  inputData: AccountingAssetsInputData
  setForm: Dispatch<SetStateAction<Partial<AccountingNewAssetForm>>>
}

export const Fields = ({ inputData, setForm }: FieldsProps) => {
  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setForm(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Name'
        type='text'
        id='name'
        name='name'
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title='Date Purchased'
        titleOnChange='datePurchased'
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title='Supported until / Warranty'
        titleOnChange='supportedUntil'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Price'
        type='number'
        id='price'
        name='price'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Serial'
        type='text'
        id='serial'
        name='serial'
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Category'
        titleOnChange='category'
        value={inputData.category[0].id}
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
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeInput('notes', event.target.value)
          }
        />
      </div>
    </div>
  )
}
