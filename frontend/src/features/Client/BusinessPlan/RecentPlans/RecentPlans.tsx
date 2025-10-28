import { Fragment, useCallback, useState } from 'react'

import { Item } from './Item/Item'
import styles from './RecentPlans.module.scss'
import { BusinessPlanItemData, RolesAccess } from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'

interface RecentPlansProps {
  access: RolesAccess
  plansData: BusinessPlanItemData[]
  changeSortName: (sortNameItem: string, sortTypeItem: number) => void
  deletePlan: (id: number) => void
}

export const RecentPlans = ({
  access,
  plansData,
  changeSortName,
  deletePlan,
}: RecentPlansProps) => {
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

  if (plansData.length === 0) {
    return (
      <div className={styles.nothingFound}>
        <span className={styles.nothingFoundText}>Nothing Found</span>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Image' style={styles.imageColumn} />
        <Title
          sorted
          title='Name'
          style={styles.nameColumn}
          sortType={sortNumbers[1]}
          sortName='account'
          sortIndex={0}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Business Model'
          style={styles.businessModelColumn}
          sortType={sortNumbers[2]}
          sortName='titleModel'
          sortIndex={1}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title
          sorted
          title='Business Plan'
          style={styles.businessPlanColumn}
          sortType={sortNumbers[3]}
          sortName='companyName'
          sortIndex={2}
          changeSortName={handleSortChange}
          clearSort={clearSort}
        />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {plansData.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                access={access}
                id={item.id}
                idClient={item.client?.id}
                image={item.client?.img}
                name={item.client?.account}
                code={item.client?.code}
                businessModel={item.businessModel?.title}
                businessPlan={item.companyName}
                token={item.publicToken}
                deletePlan={deletePlan}
              />
              {index !== plansData.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
