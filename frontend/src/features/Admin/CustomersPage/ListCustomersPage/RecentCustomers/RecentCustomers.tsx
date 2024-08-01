import React, { FC, useCallback, useState } from 'react'

import { ListCustomersData } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentCustomers.module.scss'

interface RecentCustomersProps {
  customersList: ListCustomersData[]
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
}

export const RecentCustomers: FC<RecentCustomersProps> = ({
  customersList,
  changeSortName,
}) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([
    1, 1, 1, 1, 1, 1,
  ])

  const handleSortChange = useCallback(
    (index: number, sortNameItem: string, sortTypeItem: number) => {
      setSortNumbers(prevSortNumbers =>
        prevSortNumbers.map((num, i) => (i === index ? sortTypeItem : 1)),
      )
      changeSortName(sortNameItem, sortTypeItem)
    },
    [changeSortName],
  )

  const clearSort = () => {
    setSortNumbers(new Array(6).fill(1))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          sorted
          title='Image'
          style={styles.imageColumn}
          sortType={sortNumbers[0]}
          sortName='img'
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
          sorted
          title='Company Name'
          style={styles.companyNameColumn}
          sortType={sortNumbers[2]}
          sortName='company'
          sortIndex={2}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Group'
          style={styles.groupColumn}
          sortType={sortNumbers[3]}
          sortName='group'
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
          title='Phone'
          style={styles.phoneColumn}
          sortType={sortNumbers[5]}
          sortName='phone'
          sortIndex={5}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {customersList.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                image={item.img}
                name={item.account}
                code={item.code}
                companyName={item.company?.name}
                group={item.group?.name}
                email={item.email}
                phone={item.phone}
              />
              {index !== customersList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
