import { Fragment, useCallback, useState } from 'react'

import { SalesOffersListData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'

interface RecentOffersProps {
  offersList: SalesOffersListData[]
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
  navigateToViewOffer: (idOffer: number) => void
  navigateToEditOffer: (idOffer: number) => void
  navigateToSelectAccount: (idAccount: number) => void
  deleteOffer: (idOffer: number) => void
}

export const RecentOffers = ({
  offersList,
  changeSortName,
  navigateToViewOffer,
  navigateToEditOffer,
  navigateToSelectAccount,
  deleteOffer,
}: RecentOffersProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((_num, i) => (i === index ? sortTypeItem : 0)),
      )
      changeSortName(sortNameItem, sortTypeItem)
    },
    [changeSortName],
  )

  const clearSort = () => {
    setSortNumbers(new Array(7).fill(0))
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
          sortName='total'
          sortIndex={3}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Date Created'
          style={styles.dateCreatedColumn}
          sortType={sortNumbers[4]}
          sortName='dateCreated'
          sortIndex={4}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Expiry Date'
          style={styles.expiryDateColumn}
          sortType={sortNumbers[5]}
          sortName='validUntil'
          sortIndex={5}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Stage'
          style={styles.stageColumn}
          sortType={sortNumbers[6]}
          sortName='stage'
          sortIndex={6}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {offersList.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                id={item.id}
                idAccount={item.account ? item.account.id : null}
                account={item.account ? item.account.account : null}
                code={item.code}
                subject={item.subject}
                amount={item.total}
                dateCreated={item.dateCreated}
                expiryDate={item.validUntil}
                stage={item.stage}
                navigateToViewOffer={navigateToViewOffer}
                navigateToEditOffer={navigateToEditOffer}
                navigateToSelectAccount={navigateToSelectAccount}
                deleteOffer={deleteOffer}
              />
              {index !== offersList.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
