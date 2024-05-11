import { FC } from 'react'

import { CheckBox } from '../../../../../../shared/ui/CheckBox/CheckBox'
import styles from './Item.module.scss'

interface CategoriesList {
  id: number
  name: string
}

interface SearchItemProps {
  categories: CategoriesList[]
  searchItem?: string
}

export const Item: FC<SearchItemProps> = ({ categories, searchItem }) => {
  let filteredCategories = categories

  if (searchItem) {
    filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(searchItem.toLowerCase()),
    )
  }

  return (
    <div className={styles.wrapper}>
      {filteredCategories.map(category => {
        return <CheckBox key={category.id} title={category.name} />
      })}
    </div>
  )
}
