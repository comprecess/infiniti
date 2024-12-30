import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  FiltersData,
  FiltersState,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { FromTo } from '../../../../../shared/ui/FromTo/FromTo'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPropertiesFiltering } from '../../../../../shared/utils/api/Admin/BusinessPlan/BusinessModel/GetPropertiesFiltering'
import { CategoryItem } from '../../../TalentsPage/CatalogTalents/Filters/CategoryItem/CategoryItem'
import { Item } from '../../../TalentsPage/CatalogTalents/Filters/CategoryItem/Item/Item'
import styles from './Filters.module.scss'

interface FiltersProps {
  selectedFilters: FiltersState
  setActiveCategory: (value: number) => void
  setSelectedFilters: Dispatch<SetStateAction<FiltersState>>
}

export const Filters: FC<FiltersProps> = ({
  selectedFilters,
  setActiveCategory,
  setSelectedFilters,
}) => {
  const [searchItems, setSearchItems] = useState<string[]>([])
  const [filters, setFilters] = useState<FiltersData[] | null>(null)

  const handleFiltersReset = () => {
    setSelectedFilters({})
    setActiveCategory(0)
  }

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

  const getFilters = useCallback(async () => {
    const response = await getPropertiesFiltering()

    setFilters(response.data)
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
            <span
              className={styles.buttonReset}
              onClick={handleFiltersReset}
            >
              Reset filters
            </span>
          </div>
          <div className={styles.filters}>
            {filters.map((filter, index) => (
              <Fragment key={filter.id}>
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
              </Fragment>
            ))}
          </div>
        </>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
