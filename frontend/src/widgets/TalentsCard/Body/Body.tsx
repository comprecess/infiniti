import { FC } from 'react'

import styles from './Body.module.scss'
import { Item } from './Item/Item'

interface BodyProps {
  industries: []
  keySkills: []
}

export const Body: FC<BodyProps> = ({ industries, keySkills }) => {
  return (
    <div className={styles.wrapper}>
      <Item title='Industries' tags={industries} />
      <Item title='Key skills' tags={keySkills} />
    </div>
  )
}
