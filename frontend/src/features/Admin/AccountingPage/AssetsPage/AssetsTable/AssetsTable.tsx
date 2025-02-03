import React, { useCallback, useState } from 'react'

import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './AssetsTable.module.scss'

export const AssetsTable = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_sortName, setSortName] = useState<string>('id')
  const [_sortType, setSortType] = useState<number>(1)
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1])

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
            title='Name'
            style={styles.nameColumn}
            sortType={sortNumbers[0]}
            sortName='name'
            sortIndex={0}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Date Purchased'
            style={styles.dateColumn}
            sortType={sortNumbers[1]}
            sortName='date'
            sortIndex={1}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Supported Until'
            style={styles.untilColumn}
            sortType={sortNumbers[2]}
            sortName='supportedUntil'
            sortIndex={2}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Price'
            style={styles.priceColumn}
            sortType={sortNumbers[3]}
            sortName='price'
            sortIndex={3}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title title='Manage' style={styles.manageColumn} />
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
