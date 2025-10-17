import styles from './Filters.module.scss'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'

export const Filters = () => {
  return (
    <div className={styles.wrapper}>
      <CustomSelect
        title='Customer'
        titleOnChange='customer'
        placeholder='All'
        nameList={[]}
        idList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Status'
        titleOnChange='status'
        placeholder='All'
        nameList={[]}
        idList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Staff'
        titleOnChange='staff'
        placeholder='All'
        nameList={[]}
        idList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Company'
        titleOnChange='company'
        placeholder='All'
        nameList={[]}
        idList={[]}
        onChange={() => {}}
      />
      <CustomInput
        title='Email'
        type='text'
        id='email'
        name='subject'
        onChange={() => {}}
      />
      <CustomInput
        title='Subject'
        type='text'
        id='subject'
        name='subject'
        onChange={() => {}}
      />
    </div>
  )
}
