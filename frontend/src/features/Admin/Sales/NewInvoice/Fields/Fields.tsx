import { Textarea } from '@chakra-ui/react'
import React, { FC, useState } from 'react'

import { SalesBlankData } from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import { Blank } from './Blank/Blank'
import styles from './Fields.module.scss'
import { Item } from './Item/Item'

export const Fields: FC = () => {
  const [blanks, setBlanks] = useState<SalesBlankData[]>([
    { id: 0, itemName: '', qty: 0, price: 0, tax: '', total: 0 },
  ])

  const handleAddBlank = () => {
    const newId = blanks.length

    setBlanks([
      ...blanks,
      { id: newId, itemName: '', qty: 0, price: 0, tax: '', total: 0 },
    ])
  }

  const handleBlankChange = (
    id: number,
    field: string,
    value: string | number,
  ) => {
    setBlanks(
      blanks.map(blank =>
        blank.id === id ? { ...blank, [field]: value } : blank,
      ),
    )
  }

  const handleRemoveBlank = (id: number) => {
    setBlanks(blanks.filter(blank => blank.id !== id))
  }

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
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Address</span>
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
          ---Calendar---
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
      {blanks.length > 0 && (
        <section className={styles.blank}>
          <CustomDivider />
          {blanks.map(blank => {
            return (
              <React.Fragment key={blank.id}>
                <Blank
                  onRemove={() => handleRemoveBlank(blank.id)}
                  onChange={(field, value) =>
                    handleBlankChange(blank.id, field, value)
                  }
                />
                <CustomDivider />
              </React.Fragment>
            )
          })}
        </section>
      )}
      <section className={styles.buttonsBlank}>
        <ButtonBlue
          titleNone
          title='Add Blank'
          icon='/icons/plus.svg'
          iconProps={styles.buttonAddIcon}
          style={styles.buttonBlue}
          onClick={handleAddBlank}
        />
        <ButtonBlue
          titleNone
          title='Add Product'
          icon='/icons/searchWhite.svg'
          iconProps={styles.buttonSearchIcon}
          style={styles.buttonBlue}
        />
      </section>
      <section className={styles.calculations}>
        <Item title='Sub Total' value='---0,25₽---' />
        <Item title='Discount' value='---15,32₽---' />
        <Item title='Tax' value='---765,09₽' />
        <Item title='Total' value='---1.546,00₽' />
      </section>
      <section className={styles.footerTextEditor}>
        <TextEditor
          setValue={function (_message: string): void {
            throw new Error('Function not implemented.')
          }}
        />
      </section>
    </div>
  )
}
