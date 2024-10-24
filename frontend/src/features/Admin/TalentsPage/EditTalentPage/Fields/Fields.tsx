import React, { FC, useState } from 'react'

import {
  TalentFormData,
  TalentProjectsExperience,
} from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
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
  | number
  | boolean
  | undefined
  | null
}

export const Fields: FC = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [formData, _setFormData] = useState<TalentFormData>({
    projectsExperience: [
      {
        id: 0,
        index: 0,
        position: 'Position 0',
        period: 'Period 0',
        responsibilities: 'Responsibilities 0',
      },
      {
        id: 1,
        index: 1,
        position: 'Position 1',
        period: 'Period 1',
        responsibilities: 'Responsibilities 1',
      },
    ],
  })

  return (
    <div className={styles.wrapper}>
      <CustomInput
        title='Full Name'
        type='text'
        id='fullName'
        name='fullName'
        onChange={() => {}}
      />
      <CustomDataPicker
        title='Date of Birth'
        titleOnChange='dateBirth'
        onChange={() => {}}
      />
      <CustomInput
        title='Daily Rate'
        type='number'
        id='dailyRate'
        name='dailyRate'
        onChange={() => {}}
      />
      <CustomInput
        title='Hourly Rate'
        type='number'
        id='hourlyRate'
        name='hourlyRate'
        onChange={() => {}}
      />
      <CustomSelect
        title='Gender'
        titleOnChange='gender'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Level'
        titleOnChange='level'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Customer'
        titleOnChange='customer'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <section className={styles.section}>
        <span className={styles.sectionTitle}>About talent</span>
        <div className={styles.sectionItems}>
          <TagSelector
            title='Specialization'
            list={[]}
            selectedTags={[]}
            onTagsChange={() => {}}
          />
          <TagSelector
            title='Industries'
            list={[]}
            selectedTags={[]}
            onTagsChange={() => {}}
          />
          <TagSelector
            title='Key skills'
            list={[]}
            selectedTags={[]}
            onTagsChange={() => {}}
          />
          <TagSelector
            title='All skills'
            list={[]}
            selectedTags={[]}
            onTagsChange={() => {}}
          />
          <CustomSelect
            title='Language'
            titleOnChange='language'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
          <CustomSelect
            title='Timezone'
            titleOnChange='timezone'
            idList={[]}
            nameList={[]}
            onChange={() => {}}
          />
        </div>
      </section>
      {formData.projectsExperience.length > 0 && (
        <section className={styles.section}>
          <span className={styles.sectionTitle}>
            Projects and experience
          </span>
          <div className={styles.sectionItems}>
            {formData.projectsExperience.map(item => {
              return (
                <React.Fragment key={item.id}>
                  <ProjectsExperienceItem />
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
            />
          </div>
        </section>
      )}
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Education</span>
        <div className={styles.sectionItems}>
          <TagSelector
            title='Specialization'
            list={[]}
            selectedTags={[]}
            onTagsChange={() => {}}
          />
          <CustomInput
            title='Degree'
            type='text'
            id='degree'
            name='degree'
            onChange={() => {}}
          />
          <CustomInput
            title='Graduation'
            type='text'
            id='graduation'
            name='graduation'
            onChange={() => {}}
          />
        </div>
      </section>
    </div>
  )
}
