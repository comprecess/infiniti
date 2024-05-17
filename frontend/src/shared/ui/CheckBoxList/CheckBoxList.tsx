import React, { FC } from 'react'

import { CheckBox } from '../CheckBox/CheckBox'
import styles from './CheckBoxList.module.scss'

interface LevelsList {
  id: number
  name: string
}

interface LanguagesList {
  id: number
  name: string
  levels?: LevelsList[]
}

interface CheckBoxListProps {
  languages: LanguagesList[]
  searchItem?: string
}

export const CheckBoxList: FC<CheckBoxListProps> = ({
  languages,
  searchItem,
}) => {
  let filteredLanguages = languages

  if (searchItem) {
    filteredLanguages = languages.filter(language =>
      language.name.toLowerCase().includes(searchItem.toLowerCase()),
    )
  }

  return (
    <div className={styles.wrapper}>
      {filteredLanguages.map(language => {
        return (
          <React.Fragment key={language.id}>
            <CheckBox title={language.name} image='/icons/minus.svg' />
            <div className={styles.list}>
              {language.levels?.map(level => {
                return <CheckBox key={level.id} title={level.name} />
              })}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
