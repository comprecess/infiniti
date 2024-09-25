import { Textarea } from '@chakra-ui/react'
import React, { FC } from 'react'

import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Fields.module.scss'
import { TotalItem } from './TotalItem/TotalItem'

export const Fields: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <section className={styles.section}>
          <CustomInput
            title='Subject'
            type='text'
            id='subject'
            name='subject'
            onChange={() => {}}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Address</span>
            <Textarea
              readOnly
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
          <CustomInput
            title='Offer Prefix'
            type='text'
            id='offerPrefix'
            name='offerPrefix'
            onChange={() => {}}
          />
          <CustomInput
            title='Offer #'
            type='text'
            id='offer#'
            name='offer#'
            onChange={() => {}}
          />
        </section>
        <section className={styles.section}>
          <CustomSelect
            title='Customer'
            titleOnChange='clientId'
            placeholder='None'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Stage'
            titleOnChange='stage'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Sales TAX'
            titleOnChange='tax'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomDataPicker title='Date Created' onChange={() => {}} />
          <CustomDataPicker title='Expiry Date' onChange={() => {}} />
        </section>
      </div>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>Proposal Text</span>
          <TextEditor setValue={() => {}} />
        </div>
      </section>
      {[].length > 0 && (
        <section className={styles.blank}>
          <CustomDivider />
          {[].map(_blank => (
            <React.Fragment key={''}>
              Blank
              <CustomDivider />
            </React.Fragment>
          ))}
        </section>
      )}
      <section className={styles.buttonsBlank}>
        <ButtonBlue
          titleNone
          title='Add Blank'
          icon='/icons/plus.svg'
          iconProps={styles.buttonAddIcon}
          style={styles.buttonAddNew}
          onClick={() => {}}
        />
        <ButtonBlue
          titleNone
          title='Add Product or Service'
          icon='/icons/searchWhite.svg'
          iconProps={styles.buttonSearchIcon}
          style={styles.buttonAddProduct}
          onClick={() => {}}
        />
      </section>
      <section className={styles.calculations}>
        <TotalItem title='Sub Total' />
        <TotalItem title='Discount' />
        <TotalItem title='Tax' />
        <TotalItem title='Total' />
      </section>
      <section className={styles.footerTextEditor}>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            Customer Notes
          </span>
          <TextEditor setValue={() => {}} />
        </div>
      </section>
      Add Product Or Service Panel
    </div>
  )
}
