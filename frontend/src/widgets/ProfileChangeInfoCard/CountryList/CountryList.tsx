import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC, useState } from 'react'

import { ChevronDownIcon } from '../../../shared/icons/ChevronDownIcon'
import styles from './CountryList.module.scss'

interface CountryListProps {
  country?: string
}

export const CountryList: FC<CountryListProps> = ({ country }) => {
  const [item, setItem] = useState<string>(country || 'Select Country')

  const handleItemClick = (selectedItem: string) => {
    setItem(selectedItem)
  }

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>Country</h4>
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
          <MenuItem onClick={() => handleItemClick('Select Country')}>
            Select Country
          </MenuItem>
          <MenuItem onClick={() => handleItemClick('Country 1')}>
            Country 1
          </MenuItem>
          <MenuItem onClick={() => handleItemClick('Country 2')}>
            Country 2
          </MenuItem>
          <MenuItem onClick={() => handleItemClick('Country 3')}>
            Country 3
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
