import { FC } from 'react'

import { CustomCheckBox } from '../../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import styles from './Item.module.scss'

interface CategoriesList {
  id: number
  propId: number
  value: string
}

interface SearchItemProps {
  categories: CategoriesList[]
  searchItem?: string
}

export const Item: FC<SearchItemProps> = ({ categories, searchItem }) => {
  let filteredCategories = categories

  if (searchItem) {
    filteredCategories = categories.filter(category =>
      category.value.toLowerCase().includes(searchItem.toLowerCase()),
    )
  }

  return (
    <div className={styles.wrapper}>
      {filteredCategories.map(category => {
        return <CustomCheckBox key={category.id} title={category.value} />
      })}
    </div>
  )
}
