import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  BusinessModelInputData,
  BusinessPlanBusinessModelFormData,
} from '../../../../../app/constants/constants'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import { TextEditor } from '../../../../../shared/ui/TextEditor/TextEditor'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: BusinessModelInputData
  setFormData: React.Dispatch<React.SetStateAction<PartialFieldsPostData>>
}

export interface PartialFieldsPostData
  extends Partial<BusinessPlanBusinessModelFormData> {
  [key: string]: string | number | string[] | File | undefined | null
}

export const Fields: FC<FieldsProps> = ({ inputData, setFormData }) => {
  const { t } = useTranslation()

  const handleChangeInput = (
    field: string,
    value: string | number | string[] | undefined | null,
  ) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData }

      if (value === '' || value === null || value === undefined) {
        delete updatedFormData[field]
      } else {
        updatedFormData[field] = value
      }

      return updatedFormData
    })
  }

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title={`${t('admin-make-business-model-page-input-1')}`}
        type='text'
        id='title'
        name='title'
        onChange={handleChangeInput}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-2')}`}
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
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeInput('description', event.target.value)
          }
        />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-3')}`}
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
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChangeInput('fullDescription', event.target.value)
          }
        />
      </div>
      <CustomInput
        title={`${t('admin-make-business-model-page-input-7')}`}
        type='text'
        id='price'
        name='price'
        onChange={handleChangeInput}
      />
      <CustomInput
        title={`${t('admin-make-business-model-page-input-9')}`}
        type='number'
        id='age'
        name='age'
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title={`${t('admin-make-business-model-page-input-4')}`}
        titleOnChange='start'
        onChange={handleChangeInput}
      />
      <TagSelector
        title={`${t('admin-make-business-model-page-input-5')}`}
        list={inputData.industries.map(spec => spec.value)}
        selectedTags={[]}
        onTagsChange={tags => handleChangeInput('industries', tags)}
      />
      <TagSelector
        title={`${t('admin-make-business-model-page-input-6')}`}
        list={inputData.technologies.map(spec => spec.value)}
        selectedTags={[]}
        onTagsChange={tags => handleChangeInput('technologies', tags)}
      />
      <TagSelector
        title={`${t('admin-make-business-model-page-input-8')}`}
        list={inputData.location.map(spec => spec.value)}
        selectedTags={[]}
        onTagsChange={tags => handleChangeInput('location', tags)}
      />
      <TagSelector
        title={`${t('admin-make-business-model-page-input-10')}`}
        list={inputData.category.map(spec => spec.value)}
        selectedTags={[]}
        onTagsChange={tags => handleChangeInput('category', tags)}
      />
      <CustomSelect
        title={`${t('admin-make-business-model-page-input-11')}`}
        titleOnChange='profitability'
        value={inputData.profitability[0].id}
        idList={inputData.profitability.map(item => item.id)}
        nameList={inputData.profitability.map(item => item.value)}
        onChange={handleChangeInput}
      />
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-14')}`}
        </span>
        <TextEditor chatGPT setValue={() => {}} />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-15')}`}
        </span>
        <TextEditor chatGPT setValue={() => {}} />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-16')}`}
        </span>
        <TextEditor chatGPT setValue={() => {}} />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-17')}`}
        </span>
        <TextEditor chatGPT setValue={() => {}} />
      </div>
      <div className={styles.containerItems}>
        <span className={styles.containerItemsTitle}>
          {`${t('admin-make-business-model-page-input-18')}`}
        </span>
        <TextEditor chatGPT setValue={() => {}} />
      </div>
    </div>
  )
}
