import { Fragment, useCallback, useState } from 'react'

import { Item } from './Item/Item'
import styles from './RecentExpenses.module.scss'
import { ProjectsExpensesData, RolesAccess } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentExpensesProps {
  access: RolesAccess | undefined
  expensesList: ProjectsExpensesData[]
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
  deleteExpense: (id: number) => void
}

export const RecentExpenses = ({
  access,
  expensesList,
  changeSortName,
  deleteExpense,
}: RecentExpensesProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1, 1, 1, 1])

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
    setSortNumbers(new Array(6).fill(1))
  }

  if (expensesList.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          sorted
          title='ID'
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
          title='Type'
          style={styles.typeColumn}
          sortType={sortNumbers[3]}
          sortName='type'
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
        <Title
          sorted
          title='Description'
          style={styles.descriptionColumn}
          sortType={sortNumbers[5]}
          sortName='description'
          sortIndex={5}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {expensesList.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item {...item} access={access} deleteExpense={deleteExpense} />
              {index !== expensesList.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
