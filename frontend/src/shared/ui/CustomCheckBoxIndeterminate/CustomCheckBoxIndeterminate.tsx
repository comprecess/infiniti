import classNames from 'classnames'

import styles from './CustomCheckBoxIndeterminate.module.scss'
import { Indeterminate } from './Indeterminate/Indeterminate'
import {
  FiltersState,
  LanguagesList,
} from '../../../app/constants/constants'

interface CheckBoxListProps {
  languages: LanguagesList[]
  filters: FiltersState
  searchItem?: string
  customStyles?: boolean
  onCheckboxChange: (
    propId: string,
    value: number,
    checked: boolean,
  ) => void
}

export const CustomCheckBoxIndeterminate = ({
  languages,
  filters,
  searchItem,
  customStyles = false,
  onCheckboxChange,
}: CheckBoxListProps) => {
  let filteredLanguages = languages

  if (searchItem) {
    filteredLanguages = languages.filter(language =>
      language.name.toLowerCase().includes(searchItem.toLowerCase()),
    )
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.custom]: customStyles,
      })}
    >
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
            customStyles={customStyles}
            onCheckboxChange={onCheckboxChange}
          />
        )
      })}
    </div>
  )
}
