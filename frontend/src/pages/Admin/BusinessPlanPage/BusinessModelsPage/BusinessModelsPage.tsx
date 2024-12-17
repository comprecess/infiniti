import { useEffect, useState } from 'react'

import { Filters } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/Filters/Filters'
import { ModelsList } from '../../../../features/Admin/BusinessPlanPage/BusinessModels/ModelsList/ModelsList'
import { CategoriesItem } from '../../../../features/Admin/TalentsPage/CatalogTalents/CategoriesItem/CategoriesItem'
import { TitlePage } from '../../../../features/Main/TitlePage/TitlePage'
import styles from './BusinessModelsPage.module.scss'

export const AdminBusinessModelsPage = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0)

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
          <div className={styles.categories}>
            <CategoriesItem
              name='All'
              isActive={activeCategory === 0}
              onClick={() => setActiveCategory(0)}
            />
            <CategoriesItem
              name='-Test-'
              isActive={activeCategory === 1}
              onClick={() => setActiveCategory(1)}
            />
            <CategoriesItem
              name='-Test-'
              isActive={activeCategory === 2}
              onClick={() => setActiveCategory(2)}
            />
          </div>
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
