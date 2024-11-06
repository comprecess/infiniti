import React, { FC, useCallback, useState } from 'react'

import { TalentsListCartsData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentCarts.module.scss'

interface RecentCartsProps {
  cartsList: TalentsListCartsData[]
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
}

export const RecentCarts: FC<RecentCartsProps> = ({
  cartsList,
  changeSortName,
}) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 1)),
      )
      changeSortName(sortNameItem, sortTypeItem)
    },
    [changeSortName],
  )

  const clearSort = () => {
    setSortNumbers(new Array(4).fill(1))
  }

  return (
    <div
      className={
        cartsList.length > 0 ? styles.wrapperAll : styles.wrapperNotFound
      }
    >
      {cartsList.length > 0 ? (
        <>
          <div className={styles.columns}>
            <Title
              sorted
              title='Image'
              style={styles.imageColumn}
              sortType={sortNumbers[0]}
              sortName='id'
              sortIndex={0}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Name'
              style={styles.nameColumn}
              sortType={sortNumbers[1]}
              sortName='name'
              sortIndex={1}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              title='Talents Specialization'
              style={styles.talentsSpecializationColumn}
            />
            <Title
              sorted
              title='Price'
              style={styles.priceColumn}
              sortType={sortNumbers[2]}
              sortName='total'
              sortIndex={2}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Date'
              style={styles.dateColumn}
              sortType={sortNumbers[3]}
              sortName='date'
              sortIndex={3}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title title='Manage' style={styles.manageColumn} />
          </div>
          <div className={styles.items}>
            {cartsList.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <Item
                    image={item.user.img}
                    idCustomer={item.user.id}
                    idCart={item.id}
                    name={item.user.account}
                    specialization={item.specializations}
                    price={item.total}
                    date={item.date}
                  />
                  {index !== cartsList.length - 1 && <CustomDivider />}
                </React.Fragment>
              )
            })}
          </div>
        </>
      ) : (
        <div className={styles.nothingFound}>
          <span className={styles.nothingFoundText}>Nothing Found</span>
        </div>
      )}
    </div>
  )
}
