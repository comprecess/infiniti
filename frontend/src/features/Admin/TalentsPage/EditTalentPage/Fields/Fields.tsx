import React, { FC, useEffect, useState } from 'react'

import {
  FiltersState,
  TalentEditInfoData,
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

export interface PartialFieldsPostData extends Partial<TalentFormData> {
  [key: string]:
  | string
  | TalentProjectsExperience[]
  | number[]
  | string[]
  | number
  | boolean
  | undefined
  | null
}

interface FieldsProps {
  data: TalentEditInfoData
  inputData: TalentsInputData
  onFormDataChange: (data: PartialFieldsPostData) => void
}

export const Fields: FC<FieldsProps> = ({
  data,
  inputData,
  onFormDataChange,
}) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [formData, setFormData] = useState<PartialFieldsPostData>({
    active: data.active,
    clientId: data.client?.id,
    rate:
      data.property
        .map(item => (item.rate?.[0]?.value != null ? 1 : 0))
        .find(value => value !== 0) || 0,
    educationSpecialization:
      data.property
        .map(item =>
          item.educationSpecialization?.[0]?.value != null
            ? item.educationSpecialization[0].value
            : undefined,
        )
        .find(value => value !== undefined) || '',
    educationDegree:
      data.property
        .map(item =>
          item.educationDegree?.[0]?.value != null
            ? item.educationDegree[0].value
            : undefined,
        )
        .find(value => value !== undefined) || '',
    educationGraduation:
      data.property
        .map(item =>
          item.educationGraduation?.[0]?.value != null
            ? item.educationGraduation[0].value
            : undefined,
        )
        .find(value => value !== undefined) || '',
    educationName:
      data.property
        .map(item =>
          item.educationName?.[0]?.value != null
            ? item.educationName[0].value
            : undefined,
        )
        .find(value => value !== undefined) || '',
    birthDay: data.birthDay,
    timezone:
      data.property
        .map(item =>
          item.timezone?.[0]?.id != null
            ? +item.timezone[0].id
            : undefined,
        )
        .find(value => value !== undefined) || 0,
    keySkills: data.property.flatMap(
      spec => spec.keySkills?.map(val => val.value) || [],
    ),
    allSkills: data.property.flatMap(
      spec => spec.allSkills?.map(val => val.value) || [],
    ),
    industries: data.property.flatMap(
      spec => spec.industries?.map(val => val.value) || [],
    ),
    specialization: data.property.flatMap(
      spec => spec.specialization?.map(val => val.value) || [],
    ),
    lvl:
      data.property
        .map(item =>
          item.lvl?.[0]?.id != null ? +item.lvl[0].id : undefined,
        )
        .find(value => value !== undefined) || 0,
    gender:
      data.property
        .map(item =>
          item.gender?.[0]?.id != null ? +item.gender[0].id : undefined,
        )
        .find(value => value !== undefined) || 0,
    priceDay:
      data.property
        .map(item =>
          item.priceDay?.[0]?.value != null
            ? +item.priceDay[0].value
            : undefined,
        )
        .find(value => value !== undefined) || 0,
    priceHour:
      data.property
        .map(item =>
          item.priceHour?.[0]?.value != null
            ? +item.priceHour[0].value
            : undefined,
        )
        .find(value => value !== undefined) || 0,
    blockExperience: data.blockExperience.map((block, index) => ({
      ...block,
      index,
    })),
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
    } else if (field === 'clientId' && typeof value === 'number') {
      value = value === 0 ? null : inputData.client[value - 1].id
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }))
  }

  const findMatchingLanguages = () => {
    const newSelectedFilters: FiltersState = {}

    inputData.language.forEach(language => {
      language.children.forEach(langChild => {
        const name = langChild.nameId

        data.property.forEach(prop => {
          if (prop[name]) {
            const props = prop[name]?.map(item => item.id) || []
            const propId = prop[name]?.[0]?.propId ?? ''

            if (!newSelectedFilters[propId]) {
              newSelectedFilters[propId] = []
            }

            newSelectedFilters[propId].push(...props)
          }
        })
      })
    })

    setSelectedFilters(newSelectedFilters)
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
    const allLanguages = Object.values(selectedFilters)
      .flat()
      .filter((id): id is number => id !== null)

    setFormData(prevFormData => ({
      ...prevFormData,
      language: allLanguages,
    }))
  }, [selectedFilters])

  useEffect(() => {
    findMatchingLanguages()
  }, [])

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData])

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        title='Customer'
        titleOnChange='clientId'
        placeholder='None'
        idList={inputData.client.map((_client, index) => index + 1)}
        value={
          inputData.client.findIndex(
            client => client.id === formData.clientId,
          ) + 1
        }
        nameList={inputData.client.map(client =>
          `${client.account}${
            client.email ? ` - ${client.email}` : ''
          }`.trim(),
        )}
        onChange={handleChangeInput}
      />
      <CustomDataPicker
        title='Date of Birth'
        titleOnChange='birthDay'
        value={formData.birthDay}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Daily Rate'
        type='text'
        id='priceDay'
        name='priceDay'
        value={formData.priceDay}
        onChange={handleChangeInput}
      />
      <CustomInput
        title='Hourly Rate'
        type='text'
        id='priceHour'
        name='priceHour'
        value={formData.priceHour}
        onChange={handleChangeInput}
      />
      <CustomCheckBox
        title='Taxes Included'
        titleOnChange='rate'
        defaultChecked={formData.rate === 1 ? true : false}
        onInputChange={handleChangeInput}
      />
      <CustomCheckBox
        title='Display in the Talent directory?'
        titleOnChange='active'
        defaultChecked={formData.active === 1 ? true : false}
        onInputChange={handleChangeInput}
      />
      <CustomSelect
        title='Gender'
        titleOnChange='gender'
        idList={inputData.gender.map(gender => gender.id)}
        nameList={inputData.gender.map(gender => gender.value)}
        value={formData.gender}
        onChange={handleChangeInput}
      />
      <CustomSelect
        title='Level'
        titleOnChange='lvl'
        idList={inputData.lvl.map(lvl => lvl.id)}
        nameList={inputData.lvl.map(lvl => lvl.value)}
        value={formData.lvl}
        onChange={handleChangeInput}
      />
      <section className={styles.section}>
        <span className={styles.sectionTitle}>About talent</span>
        <div className={styles.sectionItems}>
          <TagSelector
            title='Specialization'
            list={inputData.specialization.map(spec => spec.value)}
            selectedTags={formData.specialization || []}
            onTagsChange={tags =>
              handleChangeInput('specialization', tags)
            }
          />
          <TagSelector
            title='Industries'
            list={inputData.industries.map(spec => spec.value)}
            selectedTags={formData.industries || []}
            onTagsChange={tags => handleChangeInput('industries', tags)}
          />
          <TagSelector
            title='Key skills'
            list={inputData.keySkills.map(spec => spec.value)}
            selectedTags={formData.keySkills || []}
            onTagsChange={tags => handleChangeInput('keySkills', tags)}
          />
          <TagSelector
            title='All skills'
            list={inputData.allSkills.map(spec => spec.value)}
            selectedTags={formData.allSkills || []}
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
            value={formData.timezone}
            onChange={handleChangeInput}
          />
        </div>
      </section>
      {formData.blockExperience && isProjectsList && (
        <section className={styles.section}>
          <span className={styles.sectionTitle}>
            Projects and experience
          </span>
          <div className={styles.sectionItems}>
            {formData.blockExperience.map(item => {
              return (
                <React.Fragment key={item.index}>
                  <ProjectsExperienceItem
                    company={item.name}
                    position={item.position}
                    periodFrom={item.periodFrom}
                    periodTo={item.periodTo}
                    responsibilities={item.responsibilities}
                    removeBlock={() => handleRemoveExperience(item.index)}
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
            <ButtonBlue
              titleNone
              icon='/icons/plus.svg'
              title='Add Experience'
              style={styles.addExperienceButton}
              onClick={handleAddExperience}
            />
          </div>
        </section>
      )}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Education</span>
        <div className={styles.sectionItems}>
          <CustomInput
            title='Name'
            type='text'
            id='educationName'
            name='educationName'
            value={formData.educationName}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Specialization'
            type='text'
            id='educationSpecialization'
            name='educationSpecialization'
            value={formData.educationSpecialization}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Degree'
            type='text'
            id='educationDegree'
            name='educationDegree'
            value={formData.educationDegree}
            onChange={handleChangeInput}
          />
          <CustomInput
            title='Graduation'
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
