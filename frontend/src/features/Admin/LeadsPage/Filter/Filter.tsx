import styles from './Filter.module.scss'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'

export const Filter = () => {
  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='First Name'
        type='text'
        id='first-name'
        name='first-name'
        onChange={() => {}}
      />
      <CustomInput
        title='Middle Name'
        type='text'
        id='middle-name'
        name='middle-name'
        onChange={() => {}}
      />
      <CustomInput
        title='Last Name'
        type='text'
        id='last-name'
        name='last-name'
        onChange={() => {}}
      />
      <CustomInput
        title='Email'
        type='text'
        id='email'
        name='email'
        onChange={() => {}}
      />
      <CustomInput
        title='Salutation'
        type='text'
        id='salutation'
        name='salutation'
        onChange={() => {}}
      />
      <CustomInput
        title='Company'
        type='text'
        id='company'
        name='company'
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
        title='Status'
        type='text'
        id='status'
        name='status'
        onChange={() => {}}
      />
    </div>
  )
}
