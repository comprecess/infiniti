import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './AddABillPage.module.scss'

export const AddABillPage = () => {
  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Title'
        type='text'
        id='title'
        name='title'
        onChange={() => {}}
      />
      <div className={styles.containerRowFour}>
        <CustomDataPicker
          title='Next Due Date'
          titleOnChange='nextDueDate'
          onChange={() => {}}
        />
        <CustomSelect
          title='Repeat Every'
          titleOnChange='repeatEvery'
          idList={[]}
          nameList={[]}
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
          type='text'
          id='amount'
          name='amount'
          onChange={() => {}}
        />
      </div>
      <div className={styles.containerRow}>
        <CustomSelect
          title='From Account'
          titleOnChange='fromAccount'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <CustomSelect
          title='Payee'
          titleOnChange='payee'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
      </div>
      <CustomSelect
        title='Category'
        titleOnChange='category'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomInput
        title='Website'
        type='text'
        id='website'
        name='website'
        onChange={() => {}}
      />
      <ButtonBlue title='Save' style={styles.buttonSave} />
    </div>
  )
}
