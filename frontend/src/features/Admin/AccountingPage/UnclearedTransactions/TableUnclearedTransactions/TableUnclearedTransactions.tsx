import React, { useCallback, useState } from 'react'

import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './TableUnclearedTransactions.module.scss'

export const TableUnclearedTransactions = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_sortName, setSortName] = useState<string>('id')
  const [_sortType, setSortType] = useState<number>(1)
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1, 1])

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
      <div className={styles.columnsWrapper}>
        <div className={styles.columns}>
          <Title
            sorted
            title='#'
            style={styles.idColumn}
            sortType={sortNumbers[0]}
            sortName='id'
            sortIndex={0}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Date'
            style={styles.dateColumn}
            sortType={sortNumbers[1]}
            sortName='date'
            sortIndex={1}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Account'
            style={styles.accountColumn}
            sortType={sortNumbers[2]}
            sortName='account'
            sortIndex={2}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Description'
            style={styles.descriptionColumn}
            sortType={sortNumbers[3]}
            sortName='description'
            sortIndex={3}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Amount'
            style={styles.amountColumn}
            sortType={sortNumbers[4]}
            sortName='amount'
            sortIndex={4}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
        </div>
        <div className={styles.items}>
          {[].map((_item, _index) => {
            return <React.Fragment key={`id`}>Item</React.Fragment>
          })}
        </div>
      </div>
    </div>
  )
}
