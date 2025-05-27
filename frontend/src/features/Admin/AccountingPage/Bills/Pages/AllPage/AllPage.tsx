import { Fragment, useCallback, useState } from 'react'

import { AccountingBillsData } from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Search } from '../../../../../../shared/ui/Search/Search'
import { Title } from '../../../../../Main/RecentCard/Title/Title'
import styles from './AllPage.module.scss'
import { Item } from './Item/Item'

interface AllPageProps {
  bills: AccountingBillsData[]
  changeSort: (sortNameItem: string, sortTypeItem: number) => void
  setSearch: (searchItem: string) => void
  deleteBill: (idBill: number) => void
}

export const AllPage = ({
  bills,
  changeSort,
  setSearch,
  deleteBill,
}: AllPageProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([0, 0, 0])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 0)),
      )
      changeSort(sortNameItem, sortTypeItem)
    },
    [changeSort],
  )

  const clearSort = () => {
    setSortNumbers(new Array(3).fill(0))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <Search onSearchChange={setSearch} />
      </div>
      <div className={styles.wrapperAll}>
        <div className={styles.columns}>
          <Title
            sorted
            title='Title'
            style={styles.titleColumn}
            sortType={sortNumbers[0]}
            sortName='title'
            sortIndex={0}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Amount'
            style={styles.amountColumn}
            sortType={sortNumbers[1]}
            sortName='amount'
            sortIndex={1}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Next Due Date'
            style={styles.dueColumn}
            sortType={sortNumbers[2]}
            sortName='nextDate'
            sortIndex={2}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title title='Manage' style={styles.manageColumn} />
        </div>
        <div className={styles.items}>
          {bills.map((item, index) => {
            return (
              <Fragment key={item.id}>
                <Item {...item} deleteBill={deleteBill} />
                {index !== bills.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
