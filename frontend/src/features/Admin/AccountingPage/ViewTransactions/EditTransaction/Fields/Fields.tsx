import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../../shared/ui/TagSelector/TagSelector'
import styles from './Fields.module.scss'

export const Fields = () => {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        title='Account'
        titleOnChange='account'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomDataPicker
        title='Date'
        titleOnChange='date'
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
        readOnly
        title='Amount'
        type='text'
        id='amount'
        name='amount'
        onChange={() => {}}
      />
      <CustomSelect
        title='Category'
        titleOnChange='category'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <TagSelector
        title='Tags'
        list={[]}
        selectedTags={[]}
        onTagsChange={() => {}}
      />
      <CustomSelect
        title='Company'
        titleOnChange='company'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Payee'
        titleOnChange='client'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Staff'
        titleOnChange='staff'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Method'
        titleOnChange='payMethods'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomInput
        title='Ref'
        type='text'
        id='referralLink'
        name='referralLink'
        onChange={() => {}}
      />
    </div>
  )
}
