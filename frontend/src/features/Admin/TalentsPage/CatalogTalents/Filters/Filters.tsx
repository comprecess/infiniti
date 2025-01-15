import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import {
  FiltersData,
  FiltersState,
} from '../../../../../app/constants/constants'
import { CustomCheckBox } from '../../../../../shared/ui/CustomCheckBox/CustomCheckBox'
import { CustomCheckBoxIndeterminate } from '../../../../../shared/ui/CustomCheckBoxIndeterminate/CustomCheckBoxIndeterminate'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { FromTo } from '../../../../../shared/ui/FromTo/FromTo'
import { getPropertiesFiltering } from '../../../../../shared/utils/api/Client/Catalog/Properties/GetPropertiesFiltering'
import { CategoryItem } from './CategoryItem/CategoryItem'
import { Item } from './CategoryItem/Item/Item'
import styles from './Filters.module.scss'

interface FiltersProps {
  filters: FiltersData[]
  setFilters: Dispatch<SetStateAction<FiltersData[] | null>>
  selectedFilters: FiltersState
  setSort: Dispatch<SetStateAction<{ name: string; type: string }>>
  setActiveCategory: Dispatch<SetStateAction<number>>
  setSelectedFilters: Dispatch<SetStateAction<FiltersState>>
}

export const Filters: FC<FiltersProps> = ({
  filters,
  setFilters,
  selectedFilters,
  setSelectedFilters,
  setActiveCategory,
  setSort,
}) => {
  const [searchItems, setSearchItems] = useState<string[]>([])

  const { t } = useTranslation()

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

  const getFilters = useCallback(async () => {
    const filtersAnswer = await getPropertiesFiltering()

    setFilters(filtersAnswer.data)
  }, [])

  useEffect(() => {
    getFilters()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h6 className={styles.title}>
          {t('admin-catalog-talents-page-text-2')}
        </h6>
        <span className={styles.buttonReset} onClick={handleFiltersReset}>
          {t('admin-catalog-talents-page-text-3')}
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
                        selectedFilters[filter.values[0].propId]?.includes(
                          filter.values[0].id,
                        ) || false
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
    </div>
  )
}
