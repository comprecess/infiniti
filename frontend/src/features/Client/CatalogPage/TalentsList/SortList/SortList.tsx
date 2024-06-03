import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { FC, useState } from 'react'

import { ChevronDownIcon } from '../../../../../shared/icons/ChevronDownIcon'
import { LongArrowDownIcon } from '../../../../../shared/icons/LongArrowDownIcon'
import styles from './SortList.module.scss'

export const SortList: FC = () => {
  const [item, setItem] = useState<string>('Daily rate (8h) Ascending')

  const handleItemClick = (selectedItem: string) => {
    setItem(selectedItem)
  }

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
        {`Sort by: ${item}`}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => handleItemClick('Daily rate (8h) Ascending')}
        >
          Daily rate (8h) Ascending
        </MenuItem>
        <MenuItem
          onClick={() => handleItemClick('Daily rate (8h) Descending')}
        >
          Daily rate (8h) Descending
        </MenuItem>
        <MenuItem onClick={() => handleItemClick('Hourly rate Ascending')}>
          Hourly rate Ascending
        </MenuItem>
        <MenuItem
          onClick={() => handleItemClick('Hourly rate Descending')}
        >
          Hourly rate Descending
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
