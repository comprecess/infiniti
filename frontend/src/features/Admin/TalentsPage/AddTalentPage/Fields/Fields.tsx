import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  FiltersState,
  TalentFormData,
  TalentProjectsExperience,
  TalentsInputData,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomCheckBoxIndeterminate } from '../../../../../shared/ui/CustomCheckBoxIndeterminate/CustomCheckBoxIndeterminate'
import { CustomDataPicker } from '../../../../../shared/ui/CustomDataPicker/CustomDataPicker'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import { TagSelector } from '../../../../../shared/ui/TagSelector/TagSelector'
import { saveSession } from '../../../../../shared/utils/Saving/Session/SaveSession'
import styles from './Fields.module.scss'
import { ProjectsExperienceItem } from './ProjectsExperienceItem/ProjectsExperienceItem'

function loadSession<T>(name: string): T | null {
  const data = sessionStorage.getItem(name)

  return data ? (JSON.parse(data) as T) : null
}

interface FieldsProps {
  inputData: TalentsInputData
  onFormDataChange: (data: Partial<TalentFormData>) => void
}

export interface PartialFieldsPostData extends Partial<TalentFormData> {
  [key: string]:
  | string
  | number
  | number[]
  | string[]
  | FormData
  | TalentProjectsExperience[]
  | boolean
  | undefined
  | null
}

export const Fields = ({ inputData, onFormDataChange }: FieldsProps) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>(() => {
    const sessionData =
      loadSession<PartialFieldsPostData>('createTalentForm')
    if (sessionData) return sessionData

    const initialLanguageIds: number[] = []

    return {
      timezone: inputData.timezone[0].id,
      gender: inputData.gender[0].id,
      lvl: inputData.lvl[0].id,
      taxesIncluded: 0,
      active: 0,
      language: initialLanguageIds,
      blockExperience: [
        {
          index: 0,
          name: '',
          position: '',
          periodFrom: '',
          periodTo: '',
          responsibilities: '',
        },
      ],
    }
  })

  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

  const { t } = useTranslation()

  const handleChangeInput = (
    field: string,
    value:
    | string
    | number
    | number[]
    | string[]
    | boolean
    | undefined
    | null,
  ) => {
    if (
      (field === 'rate' || field === 'active') &&
      typeof value === 'boolean'
    ) {
      value = value ? 1 : 0
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (
    _propId: string,
    value: number,
    checked: boolean,
  ) => {
    setFormData(prev => {
      const current = prev.language || []
      const next = checked
        ? [...current, value]
        : current.filter(v => v !== value)

      return { ...prev, language: next }
    })
  }

  const handleExperienceChange = (
    id: number,
    field: string,
    value: string | number | undefined,
  ) => {
    setFormData(prev => ({
      ...prev,
      blockExperience: (prev.blockExperience || []).map(block =>
        block.index === id ? { ...block, [field]: value } : block,
      ),
    }))
  }

  const handleAddExperience = () => {
    setFormData(prev => {
      const newId = prev.blockExperience?.length || 0
      const newExperience: TalentProjectsExperience = {
        index: newId,
        name: '',
        position: '',
        periodFrom: '',
        periodTo: '',
        responsibilities: '',
      }

      return {
        ...prev,
        blockExperience: [...(prev.blockExperience || []), newExperience],
      }
    })
  }

  const handleRemoveExperience = (id: number) => {
    setFormData(prev => ({
      ...prev,
      blockExperience: (prev.blockExperience || []).filter(
        exp => exp.index !== id,
      ),
    }))
  }

  useEffect(() => {
    const filters: FiltersState = {}

    inputData.language[0].children.forEach(child => {
      child.values.forEach(val => {
        if (val.value && formData.language?.includes(val.id)) {
          if (!filters[val.propId]) filters[val.propId] = []
          filters[val.propId].push(val.id)
        }
      })
    })

    setSelectedFilters(filters)
  }, [formData.language, inputData.language])

  useEffect(() => {
    saveSession('createTalentForm', formData)
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  const isProjectsList =
    formData.blockExperience && formData.blockExperience.length > 0

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title={`${t('admin-talents-add-talent-page-input-1')}`}
        type='text'
        id='name'
        name='name'
        value={formData.name}
        onChange={handleChangeInput}
      />
      <CustomInput
        title={`${t('admin-talents-add-talent-page-input-19')}`}
        type='text'
        id='email'
        name='email'
        value={formData.email}
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title={`${t('admin-talents-add-talent-page-input-2')}`}
        titleOnChange='birthDay'
        value={formData.birthDay}
        onChange={handleChangeInput}
      />
      <CustomInput
        title={`${t('admin-talents-add-talent-page-input-3')}`}
        type='number'
        id='priceDay'
        name='priceDay'
        value={formData.priceDay}
        onChange={handleChangeInput}
      />
      <CustomInput
        title={`${t('admin-talents-add-talent-page-input-4')}`}
        type='number'
        id='priceHour'
        name='priceHour'
        value={formData.priceHour}
        onChange={handleChangeInput}
      />
      <CustomCheckBox
        title={`${t('admin-talents-add-talent-page-input-5')}`}
        titleOnChange='rate'
        defaultChecked={formData.rate === 1}
        onInputChange={handleChangeInput}
      />
      <CustomCheckBox
        title={`${t('admin-talents-add-talent-page-input-6')}`}
        titleOnChange='active'
        defaultChecked={formData.active === 1}
        onInputChange={handleChangeInput}
      />
      <CustomSelect
        title={`${t('admin-talents-add-talent-page-input-7')}`}
        titleOnChange='gender'
        value={formData.gender}
        idList={inputData.gender.map(g => g.id)}
        nameList={inputData.gender.map(g => g.value)}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title={`${t('admin-talents-add-talent-page-input-8')}`}
        titleOnChange='lvl'
        value={formData.lvl}
        idList={inputData.lvl.map(l => l.id)}
        nameList={inputData.lvl.map(l => l.value)}
        onChange={handleChangeInput}
      />
      <section className={styles.section}>
        <span className={styles.sectionTitle}>
          {`${t('admin-talents-add-talent-page-mini-title-1')}`}
        </span>
        <div className={styles.sectionItems}>
          <TagSelector
            title={`${t('admin-talents-add-talent-page-input-9')}`}
            list={inputData.specialization.map(spec => spec.value)}
            selectedTags={formData.specialization ?? []}
            onTagsChange={tags =>
              handleChangeInput('specialization', tags)
            }
          />
          <TagSelector
            title={`${t('admin-talents-add-talent-page-input-10')}`}
            list={inputData.industries.map(spec => spec.value)}
            selectedTags={formData.industries ?? []}
            onTagsChange={tags => handleChangeInput('industries', tags)}
          />
          <TagSelector
            title={`${t('admin-talents-add-talent-page-input-11')}`}
            list={inputData.keySkills.map(spec => spec.value)}
            selectedTags={formData.keySkills ?? []}
            onTagsChange={tags => handleChangeInput('keySkills', tags)}
          />
          <TagSelector
            title={`${t('admin-talents-add-talent-page-input-12')}`}
            list={inputData.allSkills.map(spec => spec.value)}
            selectedTags={formData.allSkills ?? []}
            onTagsChange={tags => handleChangeInput('allSkills', tags)}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>
              {`${t('admin-talents-add-talent-page-input-13')}`}
            </span>
            <CustomCheckBoxIndeterminate
              languages={inputData.language[0].children}
              filters={selectedFilters}
              onCheckboxChange={handleLanguageChange}
            />
          </div>
          <CustomSelect
            title={`${t('admin-talents-add-talent-page-input-14')}`}
            titleOnChange='timezone'
            value={formData.timezone}
            idList={inputData.timezone.map(spec => spec.id)}
            nameList={inputData.timezone.map(spec => spec.value)}
            onChange={handleChangeInput}
          />
        </div>
      </section>
      <section className={styles.section}>
        <span className={styles.sectionTitle}>
          {`${t('admin-talents-add-talent-page-mini-title-2')}`}
        </span>
        {formData.blockExperience && isProjectsList && (
          <div className={styles.sectionItems}>
            {formData.blockExperience.map(item => {
              return (
                <Fragment key={item.index}>
                  <ProjectsExperienceItem
                    form={item}
                    onRemove={() => handleRemoveExperience(item.index)}
                    onChange={(field, value) =>
                      handleExperienceChange(item.index, field, value)
                    }
                  />
                  <div className={styles.divider}>
                    <CustomDivider />
                  </div>
                </Fragment>
              )
            })}
          </div>
        )}
      </section>
      <div>
        <ButtonBlue
          titleNone
          icon='/icons/plus.svg'
          title={`${t('admin-talents-add-talent-page-button-2')}`}
          style={styles.addExperienceButton}
          onClick={handleAddExperience}
        />
      </div>
      <section className={styles.section}>
        <span className={styles.sectionTitle}>
          {`${t('admin-talents-add-talent-page-mini-title-3')}`}
        </span>
        <div className={styles.sectionItems}>
          <CustomInput
            title={`${t('admin-talents-add-talent-page-input-15')}`}
            type='text'
            id='educationName'
            name='educationName'
            value={formData.educationName}
            onChange={handleChangeInput}
          />
          <CustomInput
            title={`${t('admin-talents-add-talent-page-input-16')}`}
            type='text'
            id='educationSpecialization'
            name='educationSpecialization'
            value={formData.educationSpecialization}
            onChange={handleChangeInput}
          />
          <CustomInput
            title={`${t('admin-talents-add-talent-page-input-17')}`}
            type='text'
            id='educationDegree'
            name='educationDegree'
            value={formData.educationDegree}
            onChange={handleChangeInput}
          />
          <CustomInput
            title={`${t('admin-talents-add-talent-page-input-18')}`}
            type='text'
            id='educationGraduation'
            name='educationGraduation'
            value={formData.educationGraduation}
            onChange={handleChangeInput}
          />
        </div>
      </section>
    </div>
  )
}
