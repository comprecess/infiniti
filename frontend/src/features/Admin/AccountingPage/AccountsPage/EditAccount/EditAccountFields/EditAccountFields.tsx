import { Dispatch, SetStateAction } from 'react'

import styles from './EditAccountFields.module.scss'
import { AccountingAccountForm } from '../../../../../../app/constants/constants'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'

interface EditAccountFieldsProps {
  form: Partial<AccountingAccountForm>
  setForm: Dispatch<SetStateAction<AccountingAccountForm | null>>
}

export const EditAccountFields = ({
  form,
  setForm,
}: EditAccountFieldsProps) => {
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
        title='Account Title'
        type='text'
        id='name'
        name='name'
        value={form.name}
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
        title='Account Number'
        type='text'
        id='accountNumber'
        name='accountNumber'
        value={form.accountNumber}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Contact Person'
        type='text'
        id='contactPerson'
        name='contactPerson'
        value={form.contactPerson}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Phone'
        type='text'
        id='contactPhone'
        name='contactPhone'
        value={form.contactPhone}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Internet Banking URL'
        type='text'
        id='url'
        name='url'
        value={form.url}
        onChange={handleChangeInput}
      />
    </div>
  )
}
