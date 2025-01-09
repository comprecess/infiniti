import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { BusinessModelInputData } from '../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: BusinessModelInputData
}

export const Fields: FC<FieldsProps> = ({ inputData }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title={`${t('admin-make-business-plan-page-input-1')}`}
        type='text'
        id='title'
        name='title'
        onChange={() => {}}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-plan-page-input-2')}`}
        </span>
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
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-plan-page-input-3')}`}
        </span>
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
      <CustomDataPicker
        title={`${t('admin-make-business-plan-page-input-4')}`}
        titleOnChange='start'
        onChange={() => {}}
      />
      <TagSelector
        title={`${t('admin-make-business-plan-page-input-5')}`}
        list={inputData.industries.map(spec => spec.value)}
        selectedTags={[]}
        onTagsChange={() => {}}
      />
      <TagSelector
        title={`${t('admin-make-business-plan-page-input-6')}`}
        list={inputData.technologies.map(spec => spec.value)}
        selectedTags={[]}
        onTagsChange={() => {}}
      />
    </div>
  )
}
