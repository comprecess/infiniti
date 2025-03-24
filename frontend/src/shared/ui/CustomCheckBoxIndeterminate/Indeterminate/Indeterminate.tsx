import { useEffect, useState } from 'react'

import {
  FiltersState,
  ValuesProps,
} from '../../../../app/constants/constants'
import { CustomCheckBox } from '../../CustomCheckBox/CustomCheckBox'
import styles from './Indeterminate.module.scss'

interface ParentChildrenProps {
  languageTitle: string
  isChecked: boolean
  filters: FiltersState
  languageLevels?: ValuesProps[]
  onCheckboxChange: (
    propId: string,
    value: number,
    checked: boolean,
  ) => void
}

export const Indeterminate = ({
  languageTitle,
  isChecked,
  languageLevels,
  filters,
  onCheckboxChange,
}: ParentChildrenProps) => {
  const initialCheckedState =
    languageLevels?.map(
      level => filters[level.propId]?.includes(level.id) || false,
    ) || []
  const [checkedItems, setCheckedItems] = useState(initialCheckedState)

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = checked

    setCheckedItems(newCheckedItems)

    if (languageLevels) {
      onCheckboxChange(
        languageLevels[index].propId.toString(),
        languageLevels[index].id,
        checked,
      )
    }
  }

  const handleParentCheckboxChange = (checked: boolean) => {
    const newCheckedItems = checkedItems.map(() => checked)

    setCheckedItems(newCheckedItems)

    if (languageLevels) {
      languageLevels.forEach((level, index) => {
        if (checkedItems[index] !== checked) {
          onCheckboxChange(level.propId.toString(), level.id, checked)
        }
      })
    }
  }

  useEffect(() => {
    setCheckedItems(
      languageLevels?.map(
        level => filters[level.propId]?.includes(level.id) || false,
      ) || [],
    )
  }, [filters, languageLevels])

  useEffect(() => {
    if (isChecked) {
      handleParentCheckboxChange(true)
    }
  }, [isChecked])

  const allChecked = checkedItems.length > 0 && checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <CustomCheckBox
        title={languageTitle}
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={e => handleParentCheckboxChange(e.target.checked)}
      />
      <div className={styles.list}>
        {languageLevels?.map((level, index) => (
          <CustomCheckBox
            key={level.id}
            title={level.value}
            isChecked={checkedItems[index]}
            onChange={e => handleCheckboxChange(index, e.target.checked)}
          />
        ))}
      </div>
    </>
  )
}
