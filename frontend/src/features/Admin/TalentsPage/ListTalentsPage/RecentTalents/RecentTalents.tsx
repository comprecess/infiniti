import React, { FC, useCallback, useState } from 'react'

import {
  RolesAccess,
  TalentsData,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentTalents.module.scss'

interface RecentTalentsProps {
  access: RolesAccess
  talentsList: TalentsData[]
  deleteClient: (idTalent: number) => void
  navigateEditTalent: (idTalent: number) => void
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
}

export const RecentTalents: FC<RecentTalentsProps> = ({
  access,
  talentsList,
  deleteClient,
  navigateEditTalent,
  changeSortName,
}) => {
  const [sortNumbers, setSortNumbers] = useState<number[]>([
    1, 1, 1, 1, 1, 1,
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
          sorted
          title='Specialization'
          style={styles.specializationColumn}
          sortType={sortNumbers[2]}
          sortName='specialization'
          sortIndex={2}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Level'
          style={styles.levelColumn}
          sortType={sortNumbers[3]}
          sortName='lvl'
          sortIndex={3}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Price Day'
          style={styles.priceDayColumn}
          sortType={sortNumbers[4]}
          sortName='priceDay'
          sortIndex={4}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Price Hour'
          style={styles.priceHourColumn}
          sortType={sortNumbers[5]}
          sortName='priceHour'
          sortIndex={5}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {talentsList.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                idTalent={item.id}
                access={access}
                image={item.img}
                name={item.name}
                specialization={item.specialization}
                level={item.lvl}
                priceDay={item.priceDay}
                priceHour={item.priceHour}
                navigateEditTalent={navigateEditTalent}
                deleteClient={deleteClient}
              />
              {index !== talentsList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
