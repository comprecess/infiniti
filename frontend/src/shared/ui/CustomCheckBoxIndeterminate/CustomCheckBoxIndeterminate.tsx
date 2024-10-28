import { FC } from 'react'

import {
  FiltersState,
  LanguagesList,
} from '../../../app/constants/constants'
import styles from './CustomCheckBoxIndeterminate.module.scss'
import { Indeterminate } from './Indeterminate/Indeterminate'

interface CheckBoxListProps {
  languages: LanguagesList[]
  filters: FiltersState
  searchItem?: string
  onCheckboxChange: (
    propId: string,
    value: number,
    checked: boolean,
  ) => void
}

export const CustomCheckBoxIndeterminate: FC<CheckBoxListProps> = ({
  languages,
  filters,
  searchItem,
  onCheckboxChange,
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
        const isChecked =
          filters[language.id]?.includes(language.id) || false

        return (
          <Indeterminate
            key={language.id}
            languageTitle={language.name}
            languageLevels={language.values}
            isChecked={isChecked}
            filters={filters}
            onCheckboxChange={onCheckboxChange}
          />
        )
      })}
    </div>
  )
}
