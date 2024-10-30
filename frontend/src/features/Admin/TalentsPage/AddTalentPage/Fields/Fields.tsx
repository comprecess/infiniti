import React, { FC, useEffect, useState } from 'react'

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
import styles from './Fields.module.scss'
import { ProjectsExperienceItem } from './ProjectsExperienceItem/ProjectsExperienceItem'

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

export const Fields: FC<FieldsProps> = ({
  inputData,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    timezone: inputData.timezone[0].id,
    gender: inputData.gender[0].id,
    lvl: inputData.lvl[0].id,
    taxesIncluded: 0,
    active: 0,
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
  })

  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

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
    if (field === 'rate' && typeof value === 'boolean') {
      value = value === true ? 1 : 0
    } else if (field === 'active' && typeof value === 'boolean') {
      value = value === true ? 1 : 0
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  const handleLanguageChange = (
    propId: string,
    value: number,
    checked: boolean,
  ) => {
    setSelectedFilters(prevState => {
      const values = prevState[propId] || []
      const newValues = checked
        ? [...values, value]
        : values.filter(v => v !== value)

      if (newValues.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [propId]: _, ...rest } = prevState

        return rest
      }

      return {
        ...prevState,
        [propId]: newValues,
      }
    })
  }

  const handleExperienceChange = (
    id: number,
    field: string,
    value: string | number | undefined,
  ) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      blockExperience: (prevFormData.blockExperience || []).map(block =>
        block.index === id ? { ...block, [field]: value } : block,
      ),
    }))
  }

  const handleAddExperience = () => {
    setFormData(prevFormData => {
      const newId = prevFormData.blockExperience?.length || 0

      const newExperience: TalentProjectsExperience = {
        index: newId,
        name: '',
        position: '',
        periodFrom: '',
        periodTo: '',
        responsibilities: '',
      }

      return {
        ...prevFormData,
        blockExperience: [
          ...(prevFormData.blockExperience || []),
          newExperience,
        ],
      }
    })
  }

  const handleRemoveExperience = (id: number) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      blockExperience: (prevFormData.blockExperience || []).filter(
        exp => exp.index !== id,
      ),
    }))
  }

  const isProjectsList =
    formData.blockExperience && formData.blockExperience.length > 0

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData])

  useEffect(() => {
    const allLanguages = Object.values(selectedFilters)
      .flat()
      .filter((id): id is number => id !== null)

    setFormData(prevFormData => ({
      ...prevFormData,
      language: allLanguages,
    }))
  }, [selectedFilters])

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Full Name'
        type='text'
        id='name'
        name='name'
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title='Date of Birth'
        titleOnChange='birthDay'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Daily Rate'
        type='number'
        id='priceDay'
        name='priceDay'
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Hourly Rate'
        type='number'
        id='priceHour'
        name='priceHour'
        onChange={handleChangeInput}
      />
      <CustomCheckBox
        title='Taxes Included'
        titleOnChange='rate'
        onInputChange={handleChangeInput}
      />
      <CustomCheckBox
        title='Display in the Talent directory?'
        titleOnChange='active'
        onInputChange={handleChangeInput}
      />
      <CustomSelect
        title='Gender'
        titleOnChange='gender'
        idList={inputData.gender.map(gender => gender.id)}
        nameList={inputData.gender.map(gender => gender.value)}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Level'
        titleOnChange='lvl'
        idList={inputData.lvl.map(lvl => lvl.id)}
        nameList={inputData.lvl.map(lvl => lvl.value)}
        onChange={handleChangeInput}
      />
      <section className={styles.section}>
        <span className={styles.sectionTitle}>About talent</span>
        <div className={styles.sectionItems}>
          <TagSelector
            title='Specialization'
            list={inputData.specialization.map(spec => spec.value)}
            selectedTags={[]}
            onTagsChange={tags =>
              handleChangeInput('specialization', tags)
            }
          />
          <TagSelector
            title='Industries'
            list={inputData.industries.map(spec => spec.value)}
            selectedTags={[]}
            onTagsChange={tags => handleChangeInput('industries', tags)}
          />
          <TagSelector
            title='Key skills'
            list={inputData.keySkills.map(spec => spec.value)}
            selectedTags={[]}
            onTagsChange={tags => handleChangeInput('keySkills', tags)}
          />
          <TagSelector
            title='All skills'
            list={inputData.allSkills.map(spec => spec.value)}
            selectedTags={[]}
            onTagsChange={tags => handleChangeInput('allSkills', tags)}
          />
          <div className={styles.containerItems}>
            <span className={styles.containerItemsTitle}>Language</span>
            <CustomCheckBoxIndeterminate
              languages={inputData.language[0].children}
              filters={selectedFilters}
              onCheckboxChange={handleLanguageChange}
            />
          </div>
          <CustomSelect
            title='Timezone'
            titleOnChange='timezone'
            idList={inputData.timezone.map(spec => spec.id)}
            nameList={inputData.timezone.map(spec => spec.value)}
            onChange={handleChangeInput}
          />
        </div>
      </section>
      <section className={styles.section}>
        <span className={styles.sectionTitle}>
          Projects and experience
        </span>
        {formData.blockExperience && isProjectsList && (
          <div className={styles.sectionItems}>
            {formData.blockExperience.map(item => {
              return (
                <React.Fragment key={item.index}>
                  <ProjectsExperienceItem
                    onRemove={() => handleRemoveExperience(item.index)}
                    onChange={(field, value) =>
                      handleExperienceChange(item.index, field, value)
                    }
                  />
                  <div className={styles.divider}>
                    <CustomDivider />
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        )}
      </section>
      <section>
        <ButtonBlue
          titleNone
          icon='/icons/plus.svg'
          title='Add Experience'
          style={styles.addExperienceButton}
          onClick={handleAddExperience}
        />
      </section>
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Education</span>
        <div className={styles.sectionItems}>
          <CustomInput
            title='Name'
            type='text'
            id='educationName'
            name='educationName'
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Specialization'
            type='text'
            id='educationSpecialization'
            name='educationSpecialization'
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Degree'
            type='text'
            id='educationDegree'
            name='educationDegree'
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Graduation'
            type='text'
            id='educationGraduation'
            name='educationGraduation'
            onChange={handleChangeInput}
          />
        </div>
      </section>
    </div>
  )
}
