import { Fragment, useCallback, useState } from 'react'

import { Search } from '../../../../../../shared/ui/Search/Search'
import { Title } from '../../../../../Main/RecentCard/Title/Title'
import styles from './AllPage.module.scss'

export const AllPage = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_sortName, setSortName] = useState<string>('title')
  const [_sortType, setSortType] = useState<number>(1)
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 1)),
      )
      setSortName(sortNameItem)
      setSortType(sortTypeItem)
    },
    [],
  )

  const clearSort = () => {
    setSortNumbers(new Array(7).fill(1))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <Search onSearchChange={() => {}} />
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
            sortName='due'
            sortIndex={2}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title title='Manage' style={styles.manageColumn} />
        </div>
        <div className={styles.items}>
          {[].map((_item, _index) => {
            return <Fragment key={`id`}>Item</Fragment>
          })}
        </div>
      </div>
    </div>
  )
}
