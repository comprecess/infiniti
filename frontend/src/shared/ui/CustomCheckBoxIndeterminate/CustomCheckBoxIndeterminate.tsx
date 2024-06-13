import { FC } from 'react'

import styles from './CustomCheckBoxIndeterminate.module.scss'
import { Indeterminate } from './Indeterminate/Indeterminate'

export interface LevelsList {
  id: number
  propId: number
  value: string
}

interface LanguagesList {
  id: number
  name: string
  values: LevelsList[]
}

interface CheckBoxListProps {
  languages: LanguagesList[]
  searchItem?: string
}

export const CustomCheckBoxIndeterminate: FC<CheckBoxListProps> = ({
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
          <Indeterminate
            key={language.id}
            languageTitle={language.name}
            languageLevels={language.values}
          />
        )
      })}
    </div>
  )
}
