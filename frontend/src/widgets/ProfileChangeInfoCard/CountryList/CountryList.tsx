import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCountries } from '../../../shared/utils/api/Tools/get-countries'
import styles from './CountryList.module.scss'

interface CountryListProps {
  country?: string
  onChange: (name: string, value: string) => void
}

export const CountryList = ({ country, onChange }: CountryListProps) => {
  const [item, setItem] = useState<string>(country || 'Select Country')
  const [allCountries, setAllCountries] = useState<[string, string][]>([])

  const handleItemClick = (selectedCode: string) => {
    const selectedItem = allCountries.find(
      ([code]) => code === selectedCode,
    )
    if (selectedItem) {
      onChange('country', selectedItem[0])
      setItem(selectedItem[1])
    }
  }

  const getCountriesData = useCallback(async () => {
    const response = await getCountries()

    if (!response.status) return

    const countriesArray = Object.entries(response.data) as [
      string,
      string,
    ][]

    countriesArray.pop()

    setAllCountries(countriesArray)
  }, [])

  useEffect(() => {
    getCountriesData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>Country</h4>
      {allCountries.length > 0 ? (
        <Menu isLazy>
          <MenuButton
            height='46px'
            textAlign='start'
            bg='brand.800'
            fontSize='16px'
            fontWeight='400'
            _hover={{ bg: 'brand.800' }}
            _expanded={{ bg: 'brand.800' }}
            color='gray.400'
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            {item}
          </MenuButton>
          <MenuList>
            {allCountries.map(([code, name]) => {
              return (
                <MenuItem key={code} onClick={() => handleItemClick(code)}>
                  {name}
                </MenuItem>
              )
            })}
          </MenuList>
        </Menu>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}
