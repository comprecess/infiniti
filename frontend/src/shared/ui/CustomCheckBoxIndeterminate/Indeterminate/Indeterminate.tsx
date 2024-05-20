import { FC, useState } from 'react'

import { CustomCheckBox } from '../../CustomCheckBox/CustomCheckBox'
import { LevelsList } from '../CustomCheckBoxIndeterminate'
import styles from './Indeterminate.module.scss'

interface ParentChildrenProps {
  languageTitle: string
  languageLevels?: LevelsList[]
}

export const Indeterminate: FC<ParentChildrenProps> = ({
  languageTitle,
  languageLevels,
}) => {
  const initialCheckedState = languageLevels?.map(() => false) || []
  const [checkedItems, setCheckedItems] = useState(initialCheckedState)

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = isChecked
    setCheckedItems(newCheckedItems)
  }

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <CustomCheckBox
        title={languageTitle}
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={e =>
          setCheckedItems(
            Array(languageLevels?.length).fill(e.target.checked),
          )
        }
      />
      <div className={styles.list}>
        {languageLevels?.map((level, index) => {
          return (
            <CustomCheckBox
              key={level.id}
              title={level.name}
              isChecked={checkedItems[index]}
              onChange={e => handleCheckboxChange(index, e.target.checked)}
            />
          )
        })}
      </div>
    </>
  )
}
