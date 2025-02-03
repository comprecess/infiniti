import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './NewAccountFields.module.scss'

export const NewAccountFields = () => {
  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Account Title'
        type='text'
        id='title'
        name='title'
        onChange={() => {}}
      />
      <CustomInput
        title='Description'
        type='text'
        id='description'
        name='description'
        onChange={() => {}}
      />
      <CustomInput
        title='Initial Balance [ USD ]'
        type='number'
        id='balanceUSD'
        name='balanceUSD'
        onChange={() => {}}
      />
      <CustomInput
        title='Initial Balance [ RUB ]'
        type='number'
        id='balanceRUB'
        name='balanceRUB'
        onChange={() => {}}
      />
      <CustomInput
        title='Initial Balance [ RUB ]'
        type='number'
        id='balanceRUB'
        name='balanceRUB'
        onChange={() => {}}
      />
      <CustomInput
        title='Account Number'
        type='text'
        id='accountNumber'
        name='accountNumber'
        onChange={() => {}}
      />
      <CustomInput
        title='Contact Person'
        type='text'
        id='contactPerson'
        name='contactPerson'
        onChange={() => {}}
      />
      <CustomInput
        title='Phone'
        type='text'
        id='phone'
        name='phone'
        onChange={() => {}}
      />
      <CustomInput
        title='Internet Banking URL'
        type='text'
        id='url'
        name='url'
        onChange={() => {}}
      />
      <CustomSelect
        title='Owner'
        titleOnChange='owner'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
    </div>
  )
}
