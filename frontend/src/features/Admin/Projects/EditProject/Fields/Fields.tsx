import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Fields.module.scss'

export const Fields: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Name'
            type='text'
            id='name'
            name='name'
            onChange={() => {}}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Summary</span>
            <Textarea
              minHeight='140px'
              maxHeight='232px'
              focusBorderColor='#1b1e29'
              borderColor='#1b1e29'
              color='gray.400'
              backgroundColor='brand.800'
              border='1px solid #1b1e29'
              _hover={{ borderColor: '#1b1e29' }}
              fontSize='16px'
              fontWeight='400'
              lineHeight='24px'
            />
          </div>
          <CustomSelect
            title='Type'
            titleOnChange='type'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomInput
            title='Budget'
            type='text'
            id='budget'
            name='budget'
            onChange={() => {}}
          />
          <TagSelector
            list={[]}
            selectedTags={[]}
            onTagsChange={() => {}}
          />
        </section>
        <section className={styles.section}>
          <CustomSelect
            title='Customer'
            titleOnChange='customer'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Owner'
            titleOnChange='owner'
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
          <CustomSelect
            title='Status'
            titleOnChange='status'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Project Manager'
            titleOnChange='projectManager'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomDataPicker
            title='Start Date'
            titleOnChange='startDate'
            onChange={() => {}}
          />
          <CustomDataPicker
            title='Due Date'
            titleOnChange='dueDate'
            onChange={() => {}}
          />
        </section>
      </div>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>Details</span>
          <TextEditor setValue={() => {}} />
        </div>
      </section>
    </div>
  )
}
