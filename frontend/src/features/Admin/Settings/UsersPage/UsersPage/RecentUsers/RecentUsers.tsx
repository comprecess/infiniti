import { Fragment, useCallback, useState } from 'react'

import {
  RolesAccess,
  SettingsUsersData,
} from '../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentUsers.module.scss'

interface RecentUsersProps {
  data: SettingsUsersData[]
  access: RolesAccess
  onDeleteUser: (idUser: number) => void
  onEditUser: (idUser: number) => void
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
}

export const RecentUsers = ({
  data,
  access,
  changeSortName,
  onDeleteUser,
  onEditUser,
}: RecentUsersProps) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([1, 1, 1])

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
    setSortNumbers(new Array(3).fill(1))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title
          sorted
          title='Avatar'
          style={styles.avatarColumn}
          sortType={sortNumbers[0]}
          sortName='avatar'
          sortIndex={0}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Details'
          style={styles.detailsColumn}
          sortType={sortNumbers[1]}
          sortName='details'
          sortIndex={1}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Type'
          style={styles.typeColumn}
          sortType={sortNumbers[2]}
          sortName='type'
          sortIndex={2}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {data.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                id={item.id}
                avatar={item.img}
                name={item.fullName}
                email={item.email}
                departments={item.departments}
                phone={item.phoneNumber}
                city={item.city}
                state={item.state}
                country={item.country}
                zip={item.zip}
                type={item.role?.name}
                access={access}
                onDeleteUser={onDeleteUser}
                onEditUser={onEditUser}
              />
              {index !== data.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
