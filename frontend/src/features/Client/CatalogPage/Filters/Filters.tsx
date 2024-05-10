import { Divider } from '@mui/material'
import { FC } from 'react'

import { CatalogFilters } from '../../../../app/data/catalogFilters'
import { CategoryItem } from './CategoryItem/CategoryItem'
import { Item } from './CategoryItem/Item/Item'
import styles from './Filters.module.scss'

export const Filters: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h6 className={styles.title}>Filters</h6>
        <span className={styles.buttonReset}>Reset filters</span>
      </div>
      <div className={styles.filters}>
        <CategoryItem
          isSearched
          title='Industries'
          categoriesLength={CatalogFilters[0].list.length}
        >
          <Item categories={CatalogFilters[0].list} />
        </CategoryItem>
        <Divider className={styles.divider} />
        <CategoryItem
          isSearched
          title='Key skills'
          categoriesLength={CatalogFilters[1].list.length}
        >
          <Item categories={[]} />
        </CategoryItem>
        <Divider className={styles.divider} />
        <CategoryItem title='Rate' />
        <Divider className={styles.divider} />
        <CategoryItem
          title='Availability'
          categoriesLength={CatalogFilters[2].list.length}
        />
        <Divider className={styles.divider} />
        <CategoryItem
          isSearched
          title='Timezone'
          categoriesLength={CatalogFilters[3].list.length}
        >
          <Item categories={[]} />
        </CategoryItem>
        <Divider className={styles.divider} />
        <CategoryItem title='Experience' />
        <Divider className={styles.divider} />
        <CategoryItem
          isSearched
          title='Language'
          categoriesLength={CatalogFilters[4].list.length}
        />
        <Divider className={styles.divider} />
        <CategoryItem
          title='Gender'
          categoriesLength={CatalogFilters[5].list.length}
        />
        <Divider className={styles.divider} />
        <CategoryItem title='Age' />
      </div>
    </div>
  )
}
