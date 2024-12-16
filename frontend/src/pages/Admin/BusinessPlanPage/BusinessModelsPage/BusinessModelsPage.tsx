import { useEffect } from 'react'

import { Filters } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/Filters/Filters'
import { ModelsList } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/ModelsList/ModelsList'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import styles from './BusinessModelsPage.module.scss'

export const AdminBusinessModelsPage = () => {
  useEffect(() => {
    document.title = 'infiniti | Business Models'
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Business Models' />
      </div>
      <section className={styles.sectionFirst}>
        <div className={styles.itemsFirst}>
          <span className={styles.categoriesText}>Categories</span>
          <div className={styles.categories}>-Categories-</div>
        </div>
      </section>
      <section className={styles.sectionSecond}>
        <div className={styles.itemsSecond}>
          <Filters />
          <ModelsList />
        </div>
      </section>
    </div>
  )
}
