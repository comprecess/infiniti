import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import styles from './AddExpenseFields.module.scss'

export const AddExpenseFields = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <CustomSelect
          title='Account'
          titleOnChange='account'
          placeholder='None'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <CustomInput
          title='Code'
          type='text'
          id='code'
          name='code'
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
        <CustomSelect
          title='Currency'
          titleOnChange='currency'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <CustomInput
          title='Amount'
          type='number'
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
          title='Payer'
          titleOnChange='payer'
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
          titleOnChange='method'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <CustomSelect
          title='Status'
          titleOnChange='status'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <div className={styles.inputDescription}>
          <CustomInput
            title='Ref#'
            type='number'
            id='ref'
            name='ref'
            onChange={() => {}}
          />
          <span className={styles.description}>
            e.g. Transaction ID, Check No.
          </span>
        </div>
        <ButtonBlue title='Submit' style={styles.buttonSubmit} />
      </section>
    </div>
  )
}
