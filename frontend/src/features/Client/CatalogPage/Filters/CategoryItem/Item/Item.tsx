import { FC } from 'react'

import { FiltersState } from '../../../../../../app/constants/constants'
import { CustomCheckBox } from '../../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import styles from './Item.module.scss'

interface CategoriesList {
  id: number
  propId: number
  value: string
}

interface SearchItemProps {
  categories: CategoriesList[]
  filters: FiltersState
  searchItem?: string
  onCheckboxChange: (
    propId: string,
    value: number,
    checked: boolean,
  ) => void
}

export const Item: FC<SearchItemProps> = ({
  categories,
  filters,
  searchItem,
  onCheckboxChange,
}) => {
  let filteredCategories = categories

  if (searchItem) {
    filteredCategories = categories.filter(category =>
      category.value.toLowerCase().includes(searchItem.toLowerCase()),
    )
  }

  return (
    <div className={styles.wrapper}>
      {filteredCategories.map(category => {
        const isChecked =
          filters[category.propId]?.includes(category.id) || false

        return (
          <CustomCheckBox
            key={category.id}
            title={category.value}
            isChecked={isChecked}
            onChange={e =>
              onCheckboxChange(
                category.propId.toString(),
                category.id,
                e.target.checked,
              )
            }
          />
        )
      })}
    </div>
  )
}
