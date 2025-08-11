import { Fragment, useCallback, useState } from 'react'

import {
  AccountingAccountsData,
  AccountingAccountsInputData,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './TableAccounts.module.scss'

interface TableAccountsProps {
  accounts: AccountingAccountsData[]
  inputData: AccountingAccountsInputData
  access: RolesAccess
  changeSort: (sortNameItem: string, sortTypeItem: number) => void
  deleteAccount: (id: number) => void
  addRecordInitialBalanceAccount: (
    id: number,
    form: {
      balance: { amount: string; currency: number }[]
    },
  ) => void
}

export const TableAccounts = ({
  accounts,
  inputData,
  access,
  changeSort,
  deleteAccount,
  addRecordInitialBalanceAccount,
}: TableAccountsProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1, 1])

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
    setSortNumbers(new Array(5).fill(1))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columnsWrapper}>
        <div className={styles.columns}>
          <Title
            sorted
            title='Account'
            style={styles.accountColumn}
            sortType={sortNumbers[0]}
            sortName='name'
            sortIndex={0}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title
            sorted
            title='Balance'
            style={styles.balanceColumn}
            sortType={sortNumbers[1]}
            sortName='balance'
            sortIndex={1}
            changeSortName={handleSortChange}
            clearSort={clearSort}
          />
          <Title title='Manage' style={styles.manageColumn} />
        </div>
        <div className={styles.items}>
          {accounts.map((item, index) => {
            return (
              <Fragment key={item.id}>
                <Item
                  id={item.id}
                  access={access}
                  name={item.name}
                  balance={item.balance}
                  inputData={inputData}
                  deleteAccount={deleteAccount}
                  addRecordInitialBalanceAccount={
                    addRecordInitialBalanceAccount
                  }
                />
                {index !== accounts.length - 1 && <CustomDivider />}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
