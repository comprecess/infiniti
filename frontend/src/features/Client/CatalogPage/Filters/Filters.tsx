import React, { Dispatch, FC, SetStateAction, useState } from 'react'

import {
  FiltersData,
  FiltersState,
} from '../../../../app/constants/constants'
import { CustomCheckBox } from '../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomCheckBoxIndeterminate } from '../../../../shared/ui/CustomCheckBoxIndeterminate/CustomCheckBoxIndeterminate'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { FromTo } from '../../../../shared/ui/FromTo/FromTo'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { CategoryItem } from './CategoryItem/CategoryItem'
import { Item } from './CategoryItem/Item/Item'
import styles from './Filters.module.scss'

interface FiltersProps {
  filters: FiltersData[] | undefined
  selectedFilters: FiltersState
  setSort: Dispatch<SetStateAction<{ name: string; type: string }>>
  setActiveCategory: Dispatch<SetStateAction<number>>
  setSelectedFilters: Dispatch<SetStateAction<FiltersState>>
}

export const Filters: FC<FiltersProps> = ({
  filters,
  selectedFilters,
  setSort,
  setActiveCategory,
  setSelectedFilters,
}) => {
  const [searchItems, setSearchItems] = useState<string[]>([])

  const handleSearchChange = (index: number, value: string) => {
    setSearchItems(prevSearchItems => {
      const updatedSearchItems = [...prevSearchItems]
      updatedSearchItems[index] = value

      return updatedSearchItems
    })
  }

  const handleCheckboxChange = (
    propId: string,
    value: number,
    checked: boolean,
  ) => {
    setSelectedFilters(prevState => {
      const values = prevState[propId] || []
      const newValues = checked
        ? [...values, value]
        : values.filter(v => v !== value)

      if (newValues.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [propId]: _, ...rest } = prevState

        return rest
      }

      return {
        ...prevState,
        [propId]: newValues,
      }
    })
  }

  const handleFiltersReset = () => {
    setSort({ name: 'priceDay', type: 'asc' })
    setActiveCategory(0)
    setSelectedFilters({})
  }

  return (
    <div className={styles.wrapper}>
      {filters ? (
        <>
          <div className={styles.header}>
            <h6 className={styles.title}>Filters</h6>
            <span
              className={styles.buttonReset}
              onClick={handleFiltersReset}
            >
              Reset filters
            </span>
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
                        filters={selectedFilters}
                        onCheckboxChange={handleCheckboxChange}
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
                        filters={selectedFilters}
                        searchItem={searchItems[index]}
                        onCheckboxChange={handleCheckboxChange}
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
                              filters={selectedFilters}
                              propId={String(item.id)}
                              setSelectedFilters={setSelectedFilters}
                              placeholderFirst={`from ${item.options.placeholder.from}`}
                              placeholderSecond={`to ${item.options.placeholder.to}`}
                            />
                          )
                        })}
                        <CustomCheckBox
                          title={filter.values[0].value}
                          isChecked={
                            selectedFilters[
                              filter.values[0].propId
                            ]?.includes(filter.values[0].id) || false
                          }
                          onChange={e =>
                            handleCheckboxChange(
                              filter.values[0].propId.toString(),
                              filter.values[0].id,
                              e.target.checked,
                            )
                          }
                        />
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
                              filters={selectedFilters}
                              propId={String(item.id)}
                              setSelectedFilters={setSelectedFilters}
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
                          setSelectedFilters={setSelectedFilters}
                          filters={selectedFilters}
                          propId={String(filter.id)}
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
          </div>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
