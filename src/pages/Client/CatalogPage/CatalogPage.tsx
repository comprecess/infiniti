import { FC } from 'react'

import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import styles from './CatalogPage.module.scss'

export const ClientCatalogPage: FC = () => {
  return (
    <div className={styles.title}>
      <TitlePage title='Catalog' />
    </div>
  )
}
