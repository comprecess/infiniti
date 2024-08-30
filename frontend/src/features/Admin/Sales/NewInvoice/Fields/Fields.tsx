import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './Fields.module.scss'

export const Fields: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Title'
            type='text'
            id='title'
            name='title'
            onChange={() => {}}
          />
          <div className={styles.textArea}>
            <span className={styles.textAreaTitle}>Address</span>
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
              onChange={() => {}}
            />
          </div>
          <CustomInput
            title='Invoice Prefix'
            type='text'
            id='invoicePrefix'
            name='invoicePrefix'
            onChange={() => {}}
          />
          <CustomInput
            title='Invoice #'
            type='text'
            id='invoice'
            name='invoice'
            onChange={() => {}}
          />
          Calendar
        </section>
        <section className={styles.section}>
          <CustomSelect
            title='Customer'
            titleOnChange=''
            value=''
            selectedList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Status'
            titleOnChange=''
            value=''
            selectedList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Currency'
            titleOnChange=''
            value=''
            selectedList={[]}
            onChange={() => {}}
          />
          <CustomInput
            title='Receipt Number'
            type='text'
            id='receiptNumber'
            name='receiptNumber'
            onChange={() => {}}
          />
          <CustomInput
            title='Show quantity as'
            type='text'
            id='showQuantityAs'
            name='showQuantityAs'
            onChange={() => {}}
          />
          <CustomSelect
            title='Payment Terms'
            titleOnChange=''
            value=''
            selectedList={[]}
            onChange={() => {}}
          />
        </section>
      </div>
    </div>
  )
}
