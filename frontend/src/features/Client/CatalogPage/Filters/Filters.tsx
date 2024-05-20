import { FC, useState } from 'react'

import { CatalogFilters } from '../../../../app/data/catalogFilters'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomCheckBoxIndeterminate } from '../../../../shared/ui/CustomCheckBoxIndeterminate/CustomCheckBoxIndeterminate'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { FromTo } from '../../../../shared/ui/FromTo/FromTo'
import { CategoryItem } from './CategoryItem/CategoryItem'
import { Item } from './CategoryItem/Item/Item'
import styles from './Filters.module.scss'

export const Filters: FC = () => {
  const [searchItems, setSearchItems] = useState<string[]>([])

  const handleSearchChange = (index: number, value: string) => {
    setSearchItems(prevSearchItems => {
      const updatedSearchItems = [...prevSearchItems]
      updatedSearchItems[index] = value

      return updatedSearchItems
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h6 className={styles.title}>Filters</h6>
        <span className={styles.buttonReset}>Reset filters</span>
      </div>

      <div className={styles.filters}>
        {/* Category: "Industries" */}
        <CategoryItem
          isSearched
          title='Industries'
          secondName={CatalogFilters[0].list.length.toString()}
          handleSearchChange={value => handleSearchChange(0, value)}
        >
          <Item
            categories={CatalogFilters[0].list}
            searchItem={searchItems[0]}
          />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Key skills" */}
        <CategoryItem
          isSearched
          title='Key skills'
          secondName={CatalogFilters[1].list.length.toString()}
          handleSearchChange={value => handleSearchChange(1, value)}
        >
          <Item
            categories={CatalogFilters[1].list}
            searchItem={searchItems[1]}
          />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Rate" */}
        <CategoryItem title='Rate' secondName='€ – EUR'>
          <div className={styles.items}>
            <FromTo
              title='Hourly'
              placeholderFirst='from 1'
              placeholderSecond='to 250'
            />
            <FromTo
              title='Daily (8h)'
              placeholderFirst='from 1'
              placeholderSecond='to 1 500'
            />
            <CustomCheckBox title='Taxes included' />
          </div>
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Availability" */}
        <CategoryItem
          title='Availability'
          secondName={CatalogFilters[2].list.length.toString()}
        >
          <Item categories={CatalogFilters[2].list} />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Timezone" */}
        <CategoryItem
          isSearched
          title='Timezone'
          secondName={CatalogFilters[3].list.length.toString()}
          handleSearchChange={value => handleSearchChange(2, value)}
        >
          <Item
            categories={CatalogFilters[3].list}
            searchItem={searchItems[2]}
          />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Experience" */}
        <CategoryItem title='Experience'>
          <FromTo
            title='Years'
            placeholderFirst='from 1'
            placeholderSecond='to 35'
          />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Language" */}
        <CategoryItem
          isSearched
          title='Language'
          secondName={CatalogFilters[4].list.length.toString()}
          handleSearchChange={value => handleSearchChange(3, value)}
        >
          <CustomCheckBoxIndeterminate
            languages={CatalogFilters[4].list}
            searchItem={searchItems[3]}
          />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Gender" */}
        <CategoryItem
          title='Gender'
          secondName={CatalogFilters[5].list.length.toString()}
        >
          <Item categories={CatalogFilters[5].list} />
        </CategoryItem>

        <CustomDivider />

        {/* Category: "Age" */}
        <CategoryItem title='Age'>
          <FromTo placeholderFirst='from 0' placeholderSecond='to 65' />
        </CategoryItem>

        <CustomDivider />
      </div>
    </div>
  )
}
