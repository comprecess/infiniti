import React, { FC, useCallback, useState } from 'react'

import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import styles from './RecentOffers.module.scss'

interface RecentOffersProps {
  offersList: []
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
}

export const RecentOffers: FC<RecentOffersProps> = ({
  offersList,
  changeSortName,
}) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([
    1, 1, 1, 1, 1, 1, 1, 1,
  ])

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
    setSortNumbers(new Array(8).fill(1))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          sorted
          title='#'
          style={styles.codeColumn}
          sortType={sortNumbers[0]}
          sortName='code'
          sortIndex={0}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Account'
          style={styles.accountColumn}
          sortType={sortNumbers[1]}
          sortName='account'
          sortIndex={1}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Subject'
          style={styles.subjectColumn}
          sortType={sortNumbers[2]}
          sortName='subject'
          sortIndex={2}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Amount'
          style={styles.amountColumn}
          sortType={sortNumbers[3]}
          sortName='amount'
          sortIndex={3}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Email'
          style={styles.emailColumn}
          sortType={sortNumbers[4]}
          sortName='email'
          sortIndex={4}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Date Created'
          style={styles.dateCreatedColumn}
          sortType={sortNumbers[5]}
          sortName='dateCreated'
          sortIndex={5}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Expiry Date'
          style={styles.dateExpiryColumn}
          sortType={sortNumbers[6]}
          sortName='expiryDate'
          sortIndex={6}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Stage'
          style={styles.stageColumn}
          sortType={sortNumbers[7]}
          sortName='stage'
          sortIndex={7}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {offersList.map((item, index) => {
          return (
            <React.Fragment key={`item.id-${index}`}>
              Item
              {index !== offersList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
