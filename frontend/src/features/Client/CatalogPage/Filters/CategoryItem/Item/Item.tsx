import { FC } from 'react'

import { CheckBox } from '../../../../../../shared/ui/CheckBox/CheckBox'
import styles from './Item.module.scss'

interface SearchItemProps {
  categories: string[]
}

export const Item: FC<SearchItemProps> = ({ categories }) => {
  return (
    <div className={styles.wrapper}>
      {categories.map(category => {
        return <CheckBox key={category} title={category} />
      })}
    </div>
  )
}
