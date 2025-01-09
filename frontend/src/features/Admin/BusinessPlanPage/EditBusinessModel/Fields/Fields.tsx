import { Textarea } from '@chakra-ui/react'
import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import {
  BusinessModelInputData,
  BusinessPlanBusinessModelFormData,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import styles from './Fields.module.scss'

interface FieldsProps {
  inputData: BusinessModelInputData
  formData: PartialFieldsPostData
  setFormData: React.Dispatch<React.SetStateAction<PartialFieldsPostData>>
  removePicture: (data: { [key: string]: number }) => void
  updatePicture: (file: FormData) => void
}

export interface PartialFieldsPostData
  extends Partial<BusinessPlanBusinessModelFormData> {
  [key: string]: string | number | string[] | undefined | null
}

export const Fields: FC<FieldsProps> = ({
  inputData,
  formData,
  setFormData,
  removePicture,
  updatePicture,
}) => {
  const { t } = useTranslation()

  const showToast = useCustomToast()
  const inputRefFirst = useRef<HTMLInputElement>(null)
  const inputRefSecond = useRef<HTMLInputElement>(null)

  const handleButtonUploadPreview = () => {
    inputRefFirst.current?.click()
  }

  const handleButtonUploadContent = () => {
    inputRefSecond.current?.click()
  }

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    key: 'preview' | 'content',
  ) => {
    const files = event.target.files

    if (files && files.length > 0) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'].includes(
          files[0].type,
        )
      ) {
        showToast({
          title: 'Error',
          description: 'Only JPEG and PNG images are allowed',
          status: 'error',
        })

        return
      }

      const file = new FormData()

      file.append(key, files[0])

      updatePicture(file)
    }
  }

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
      <div className={styles.wrapper}>
        <CustomInput
          title={`${t('admin-edit-business-plan-page-input-1')}`}
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChangeInput}
        />
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            {`${t('admin-edit-business-plan-page-input-2')}`}
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
            defaultValue={formData.description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeInput('description', event.target.value)
            }
          />
        </div>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            {`${t('admin-edit-business-plan-page-input-3')}`}
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
            defaultValue={formData.fullDescription}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeInput('fullDescription', event.target.value)
            }
          />
        </div>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            {t('admin-make-business-plan-page-input-12')}
          </span>
          <div className={styles.avatarContainer}>
            {formData.preview && (
              <img
                src={formData.preview}
                alt='Avatar'
                className={styles.avatar}
              />
            )}
            <div className={styles.buttonsContainer}>
              <div className={styles.uploadPicture}>
                <ButtonBlue
                  title='Upload picture'
                  style={styles.buttonUpload}
                  onClick={handleButtonUploadPreview}
                />
                <input
                  ref={inputRefFirst}
                  type='file'
                  style={{ display: 'none' }}
                  onChange={event => handleAvatarChange(event, 'preview')}
                />
              </div>
              {formData.preview && (
                <ButtonBlue
                  title='Remove picture'
                  style={styles.buttonRemove}
                  onClick={() => removePicture({ previewDelete: 1 })}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.containerItems}>
          <span className={styles.containerItemsTitle}>
            {t('admin-make-business-plan-page-input-13')}
          </span>
          <div className={styles.avatarContainer}>
            {formData.content && (
              <img
                src={formData.content}
                alt='Avatar'
                className={styles.avatar}
              />
            )}
            <div className={styles.buttonsContainer}>
              <div className={styles.uploadPicture}>
                <ButtonBlue
                  title='Upload picture'
                  style={styles.buttonUpload}
                  onClick={handleButtonUploadContent}
                />
                <input
                  ref={inputRefSecond}
                  type='file'
                  style={{ display: 'none' }}
                  onChange={event => handleAvatarChange(event, 'content')}
                />
              </div>
              {formData.content && (
                <ButtonBlue
                  title='Remove picture'
                  style={styles.buttonRemove}
                  onClick={() => removePicture({ contentDelete: 1 })}
                />
              )}
            </div>
          </div>
        </div>
        <CustomInput
          title={`${t('admin-edit-business-plan-page-input-7')}`}
          type='text'
          id='price'
          name='price'
          value={formData.price}
          onChange={handleChangeInput}
        />
        <CustomInput
          title={`${t('admin-edit-business-plan-page-input-9')}`}
          type='number'
          id='age'
          name='age'
          value={formData.age}
          onChange={handleChangeInput}
        />
        <CustomDataPicker
          title={`${t('admin-edit-business-plan-page-input-4')}`}
          titleOnChange='start'
          value={formData.start}
          onChange={handleChangeInput}
        />
        <TagSelector
          title={`${t('admin-edit-business-plan-page-input-5')}`}
          list={inputData.industries.map(spec => spec.value)}
          selectedTags={formData.industries || []}
          onTagsChange={tags => handleChangeInput('industries', tags)}
        />
        <TagSelector
          title={`${t('admin-edit-business-plan-page-input-6')}`}
          list={inputData.technologies.map(spec => spec.value)}
          selectedTags={formData.technologies || []}
          onTagsChange={tags => handleChangeInput('technologies', tags)}
        />
        <TagSelector
          title={`${t('admin-edit-business-plan-page-input-8')}`}
          list={inputData.location.map(spec => spec.value)}
          selectedTags={formData.location || []}
          onTagsChange={tags => handleChangeInput('location', tags)}
        />
        <TagSelector
          title={`${t('admin-edit-business-plan-page-input-10')}`}
          list={inputData.category.map(spec => spec.value)}
          selectedTags={formData.category || []}
          onTagsChange={tags => handleChangeInput('category', tags)}
        />
        <CustomSelect
          title={`${t('admin-edit-business-plan-page-input-11')}`}
          titleOnChange='profitability'
          idList={inputData.profitability.map(item => item.id)}
          nameList={inputData.profitability.map(item => item.value)}
          value={formData.profitability}
          onChange={handleChangeInput}
        />
      </div>
    </div>
  )
}
