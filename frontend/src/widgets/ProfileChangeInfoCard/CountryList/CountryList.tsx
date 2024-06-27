import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC, useCallback, useEffect, useState } from 'react'

import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCountries } from '../../../shared/utils/api/Tools/GetCountries'
import styles from './CountryList.module.scss'

interface CountriesResponse {
  [key: string]: string
}

interface CountryListProps {
  country?: string
  onChange: (name: string, value: string) => void
}

export const CountryList: FC<CountryListProps> = ({
  country,
  onChange,
}) => {
  const [item, setItem] = useState<string>(country || 'Select Country')
  const [allCountries, setAllCountries] = useState<
  [string, string][] | null
  >(null)

  const handleItemClick = (selectedItem: string) => {
    onChange('country', selectedItem)
    setItem(selectedItem)
  }

  const getCountriesData = useCallback(async () => {
    const countriesResponse: CountriesResponse = await getCountries()
    const countriesArray = Object.entries(countriesResponse)

    countriesArray.pop()

    setAllCountries(countriesArray)
  }, [])

  useEffect(() => {
    getCountriesData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>Country</h4>
      {allCountries ? (
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
                <MenuItem key={code} onClick={() => handleItemClick(name)}>
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
