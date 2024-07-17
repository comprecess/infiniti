import { FC, useCallback } from 'react'

import { ArrowItem } from '../../../../../Client/CatalogPage/TalentsList/PagesList/ArrowItem/ArrowItem'
import styles from './PagesList.module.scss'

export const PagesList: FC = () => {
  const nextArrowPage = useCallback(() => {}, [])

  const lastArrowPage = useCallback(() => {}, [])

  return (
    <div className={styles.wrapper}>
      <ArrowItem onClick={lastArrowPage} />
      Pages
      <ArrowItem isLeftArrow={false} onClick={nextArrowPage} />
    </div>
  )
}
