import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import styles from './NewTransferFields.module.scss'

export const NewTransferFields = () => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <CustomSelect
          title='From'
          titleOnChange='from'
          placeholder='None'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <CustomSelect
          title='To'
          titleOnChange='to'
          placeholder='None'
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
        <TagSelector
          title='Tags'
          list={[]}
          selectedTags={[]}
          onTagsChange={() => {}}
        />
        <CustomSelect
          title='Method'
          titleOnChange='method'
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
