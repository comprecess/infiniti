import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'

import { ChevronDownIcon } from '../../../../../shared/icons/ChevronDownIcon'
import { LongArrowDownIcon } from '../../../../../shared/icons/LongArrowDownIcon'
import styles from './SortList.module.scss'

interface SortListProps {
  sort: {
    sort: { name: string; type: string }
  }
  setSort: React.Dispatch<
  React.SetStateAction<{ sort: { name: string; type: string } }>
  >
}

export const SortList: FC<SortListProps> = ({ sort, setSort }) => {
  const [item, setItem] = useState<string>('Daily rate (8h) Ascending')

  const handleItemClick = (
    selectedItem: string,
    sortName: string,
    sortTypeString: string,
  ) => {
    setItem(selectedItem)

    setSort({ sort: { name: sortName, type: sortTypeString } })
  }

  useEffect(() => {
    if (sort.sort.name === 'priceDay' && sort.sort.type === 'asc') {
      setItem('Daily rate (8h) Ascending')
    }
  }, [sort])

  return (
    <Menu isLazy>
      <MenuButton
        className={styles.menuButton}
        display='flex'
        width='100%'
        maxWidth='252px'
        height='48px'
        fontSize='medium'
        fontWeight='small'
        lineHeight='24px'
        transition='all 0.2s'
        _hover={{ bg: 'brand.800' }}
        _expanded={{ bg: 'brand.800' }}
        borderRadius='8px'
        padding='12px'
        justifyContent='end'
        color='gray.200'
        bg='brand.900'
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<LongArrowDownIcon />}
      >
        {item}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() =>
            handleItemClick('Daily rate (8h) Ascending', 'priceDay', 'asc')
          }
        >
          Daily rate (8h) Ascending
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleItemClick(
              'Daily rate (8h) Descending',
              'priceDay',
              'desc',
            )
          }
        >
          Daily rate (8h) Descending
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleItemClick('Hourly rate Ascending', 'priceHour', 'asc')
          }
        >
          Hourly rate Ascending
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleItemClick('Hourly rate Descending', 'priceHour', 'desc')
          }
        >
          Hourly rate Descending
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
