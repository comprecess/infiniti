import { FC, useState } from 'react'

import { CatalogCategories } from '../../../app/data/catalogCategories'
import { CategoriesItem } from '../../../features/Client/CatalogPage/CategoriesItem/CategoriesItem'
import { Filters } from '../../../features/Client/CatalogPage/Filters/Filters'
import { TalentsList } from '../../../features/Client/CatalogPage/TalentsList/TalentsList'
import { TitlePage } from '../../../features/Main/TitlePage/TitlePage'
import styles from './CatalogPage.module.scss'

export const ClientCatalogPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const setCategories = (category: string) => {
    setActiveCategory(category)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <TitlePage title='Catalog' />
      </div>
      <section className={styles.sectionFirst}>
        <div className={styles.itemsFirst}>
          <span className={styles.categoriesText}>Categories</span>
          <div className={styles.categories}>
            <CategoriesItem
              name='All'
              isActive={activeCategory === 'All'}
              onClick={() => setCategories('All')}
            />
            {CatalogCategories.map(category => {
              return (
                <CategoriesItem
                  key={category}
                  name={category}
                  isActive={activeCategory === category}
                  onClick={() => setCategories(category)}
                />
              )
            })}
          </div>
        </div>
      </section>
      <section className={styles.sectionSecond}>
        <div className={styles.itemsSecond}>
          <Filters />
          <TalentsList />
        </div>
      </section>
    </div>
  )
}
