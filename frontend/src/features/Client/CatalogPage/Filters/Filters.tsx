import React, { FC, useCallback, useEffect, useState } from 'react'

import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomCheckBoxIndeterminate } from '../../../../shared/ui/CustomCheckBoxIndeterminate/CustomCheckBoxIndeterminate'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { FromTo } from '../../../../shared/ui/FromTo/FromTo'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Catalog/Properties/GetPropertiesFiltering'
import { CategoryItem } from './CategoryItem/CategoryItem'
import { Item } from './CategoryItem/Item/Item'
import styles from './Filters.module.scss'

interface FilterData {
  data: {
    id: number
    name: string
    nameId: string
    type: string
    children: any[]
    values: any[]
  }[]
}

export const Filters: FC = () => {
  const [searchItems, setSearchItems] = useState<string[]>([])
  const [filters, setFilters] = useState<
    {
      id: number
      name: string
      nameId: string
      type: string
      children: any[]
      values: any[]
    }[]
  >([])

  const handleSearchChange = (index: number, value: string) => {
    setSearchItems(prevSearchItems => {
      const updatedSearchItems = [...prevSearchItems]
      updatedSearchItems[index] = value

      return updatedSearchItems
    })
  }

  const getFilters = useCallback(async () => {
    const filtersAnswer: FilterData = await getPropertiesFiltering()

    setFilters(filtersAnswer.data)
  }, [])

  useEffect(() => {
    getFilters()
  }, [])

  console.log('Filters.tsx', filters)

  return (
    <div className={styles.wrapper}>
      {filters.length > 0 ? (
        <>
          <div className={styles.header}>
            <h6 className={styles.title}>Filters</h6>
            <span className={styles.buttonReset}>Reset filters</span>
          </div>

          <div className={styles.filters}>
            {filters.map((filter, index) => (
              <React.Fragment key={filter.id}>
                {filter.type === 'checkbox' && (
                  <>
                    <CategoryItem
                      isSearched
                      title={filter.name}
                      secondName={filter.values.length.toString()}
                      handleSearchChange={value =>
                        handleSearchChange(index, value)
                      }
                    >
                      <Item
                        categories={filter.values}
                        searchItem={searchItems[index]}
                      />
                    </CategoryItem>
                    <CustomDivider />
                  </>
                )}
                {filter.type === 'checkboxIndeterminate' && (
                  <CategoryItem
                    isSearched
                    title={filter.name}
                    secondName={filter.children.length.toString()}
                    handleSearchChange={value =>
                      handleSearchChange(index, value)
                    }
                  >
                    <CustomCheckBoxIndeterminate
                      languages={filter.children}
                      searchItem={searchItems[index]}
                    />
                  </CategoryItem>
                )}
              </React.Fragment>
            ))}

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

            {/* Category: "Experience" */}
            <CategoryItem title='Experience'>
              <FromTo
                title='Years'
                placeholderFirst='from 1'
                placeholderSecond='to 35'
              />
            </CategoryItem>

            <CustomDivider />

            {/* Category: "Age" */}
            <CategoryItem title='Age'>
              <FromTo
                placeholderFirst='from 0'
                placeholderSecond='to 65'
              />
            </CategoryItem>

            <CustomDivider />
          </div>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
