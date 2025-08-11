import { Fragment, useCallback, useState } from 'react'

import {
  AccountingAssetsDataData,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './AssetsTable.module.scss'
import { Item } from './Item/Item'

interface AssetsTableProps {
  assets: AccountingAssetsDataData[]
  access: RolesAccess
  deleteAsset: (id: number) => void
  changeSort: (sortNameItem: string, sortTypeItem: number) => void
}

export const AssetsTable = ({
  assets,
  access,
  deleteAsset,
  changeSort,
}: AssetsTableProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 1)),
      )
      changeSort(sortNameItem, sortTypeItem)
    },
    [changeSort],
  )

  const clearSort = () => {
    setSortNumbers(new Array(4).fill(1))
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
            sortName='datePurchased'
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
          {assets.map((asset, index) => {
            return (
              <Fragment key={asset.id}>
                <Item
                  access={access}
                  deleteAsset={deleteAsset}
                  {...asset}
                />
                {index !== assets.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
