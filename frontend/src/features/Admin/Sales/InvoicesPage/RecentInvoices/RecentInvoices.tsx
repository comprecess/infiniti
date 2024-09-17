import React, { FC, useCallback, useState } from 'react'

import { ViewInvoicesRecentData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentInvoices.module.scss'

interface RecentInvoicesProps {
  invoicesList: ViewInvoicesRecentData[]
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
  deleteInvoice: (idInvoice: number) => void
  stopRecurringInvoice: (
    idInvoice: number,
    type: '/clone' | '/stopRecurring',
  ) => void
  navigateToSelectAccount: (idAccount: number) => void
  navigateToSelectInvoice: (idInvoice: number) => void
}

export const RecentInvoices: FC<RecentInvoicesProps> = ({
  invoicesList,
  changeSortName,
  deleteInvoice,
  stopRecurringInvoice,
  navigateToSelectAccount,
  navigateToSelectInvoice,
}) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([
    1, 1, 1, 1, 1, 1, 1,
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
    setSortNumbers(new Array(7).fill(1))
  }

  return (
    <div className={styles.wrapper}>
      {invoicesList.length > 0 ? (
        <>
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
              title='Amount'
              style={styles.amountColumn}
              sortType={sortNumbers[2]}
              sortName='amount'
              sortIndex={2}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Invoice Date'
              style={styles.invoiceDateColumn}
              sortType={sortNumbers[3]}
              sortName='invoiceDate'
              sortIndex={3}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Due Date'
              style={styles.dueDateColumn}
              sortType={sortNumbers[4]}
              sortName='dueDate'
              sortIndex={4}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Status'
              style={styles.statusColumn}
              sortType={sortNumbers[5]}
              sortName='status'
              sortIndex={5}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Type'
              style={styles.typeColumn}
              sortType={sortNumbers[6]}
              sortName='type'
              sortIndex={6}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title title='Manage' style={styles.manageColumn} />
          </div>
          <div className={styles.items}>
            {invoicesList.map((item, index) => {
              return (
                <React.Fragment key={`${item.code}-${index}`}>
                  <Item
                    id={item.id}
                    idAccount={item.account.id}
                    code={item.code}
                    account={item.account}
                    amount={item.amount}
                    invoiceDate={item.invoiceDate}
                    dueDate={item.dueDate}
                    status={item.status}
                    type={item.type}
                    deleteInvoice={deleteInvoice}
                    stopRecurringInvoice={stopRecurringInvoice}
                    navigateToSelectAccount={navigateToSelectAccount}
                    navigateToSelectInvoice={navigateToSelectInvoice}
                  />
                  {index !== invoicesList.length - 1 && <CustomDivider />}
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
