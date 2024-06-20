import React, { FC, useCallback, useEffect, useState } from 'react'

import { FiltersData } from '../../../../app/constants/constants'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomCheckBoxIndeterminate } from '../../../../shared/ui/CustomCheckBoxIndeterminate/CustomCheckBoxIndeterminate'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { FromTo } from '../../../../shared/ui/FromTo/FromTo'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPropertiesFiltering } from '../../../../shared/utils/api/Catalog/Properties/GetPropertiesFiltering'
import { CategoryItem } from './CategoryItem/CategoryItem'
import { Item } from './CategoryItem/Item/Item'
import styles from './Filters.module.scss'

export const Filters: FC = () => {
  const [searchItems, setSearchItems] = useState<string[]>([])
  const [filters, setFilters] = useState<FiltersData[] | null>(null)

  const handleSearchChange = (index: number, value: string) => {
    setSearchItems(prevSearchItems => {
      const updatedSearchItems = [...prevSearchItems]
      updatedSearchItems[index] = value

      return updatedSearchItems
    })
  }

  const getFilters = useCallback(async () => {
    const filtersAnswer = await getPropertiesFiltering()

    setFilters(filtersAnswer.data)
  }, [])

  useEffect(() => {
    getFilters()
  }, [])

  return (
    <div className={styles.wrapper}>
      {filters ? (
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
                  <>
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
                    <CustomDivider />
                  </>
                )}
                {filter.type === 'checkboxOnlyForValue' && (
                  <>
                    <CategoryItem title={filter.name} secondName='€ – EUR'>
                      <div className={styles.items}>
                        {filter.children.map(item => {
                          return (
                            <FromTo
                              key={item.id}
                              title={item.name}
                              placeholderFirst={`from ${item.options.placeholder.from}`}
                              placeholderSecond={`to ${item.options.placeholder.to}`}
                            />
                          )
                        })}
                        <CustomCheckBox title={filter.values[0].value} />
                      </div>
                    </CategoryItem>
                    <CustomDivider />
                  </>
                )}
                {filter.type === null && (
                  <>
                    <CategoryItem title={filter.name}>
                      <div className={styles.items}>
                        {filter.children.map(item => {
                          return (
                            <FromTo
                              key={item.id}
                              title={item.name}
                              placeholderFirst={`from ${item.options.placeholder.from}`}
                              placeholderSecond={`to ${item.options.placeholder.to}`}
                            />
                          )
                        })}
                      </div>
                    </CategoryItem>
                    <CustomDivider />
                  </>
                )}
                {filter.type === 'integer' && (
                  <>
                    <CategoryItem title={filter.name}>
                      <div className={styles.items}>
                        <FromTo
                          key={filter.id}
                          placeholderFirst={`from ${filter.options.placeholder.from}`}
                          placeholderSecond={`to ${filter.options.placeholder.to}`}
                        />
                      </div>
                    </CategoryItem>
                    <CustomDivider />
                  </>
                )}
              </React.Fragment>
            ))}
            <div className={styles.buttonSubmit}>
              <ButtonBrand title={'Submit'} />
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
