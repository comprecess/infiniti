import styles from './Fields.module.scss'
import { PaperClipIcon } from '../../../../shared/icons/PaperClipIcon'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../shared/ui/TextEditor/TextEditor'

export const Fields = () => {
  return (
    <div className={styles.wrapper}>
      <CustomInput
        readOnly
        title='Full Name'
        type='text'
        id='name'
        name='name'
        onChange={() => {}}
      />
      <CustomInput
        readOnly
        title='Email'
        type='text'
        id='email'
        name='email'
        onChange={() => {}}
      />
      <CustomInput
        title='Subject'
        type='text'
        id='subject'
        name='subject'
        onChange={() => {}}
      />
      <div className={styles.selections}>
        <CustomSelect
          title='Department'
          titleOnChange='department'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
        <CustomSelect
          title='Priority'
          titleOnChange='priority'
          idList={[]}
          nameList={[]}
          onChange={() => {}}
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>Description</span>
        <TextEditor fieldName='description' setValue={() => {}} />
      </div>
      <div className={styles.attach}>
        <PaperClipIcon style={styles.icon} />
        <span>Attach file</span>
      </div>
      <ButtonBlue title='Submit' style={styles.buttonSave} />
    </div>
  )
}
