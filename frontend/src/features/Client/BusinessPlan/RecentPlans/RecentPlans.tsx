import { Fragment, useCallback, useState } from 'react'

import {
  BusinessPlanItemData,
  RolesAccess,
} from '../../../../app/constants/constants'
import { CustomDivider } from '../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentPlans.module.scss'

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
    <div className={styles.wrapper}>
      {plansData.length > 0 ? (
        <>
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
              title='Business Model'
              style={styles.businessModelColumn}
              sortType={sortNumbers[2]}
              sortName='company'
              sortIndex={2}
              changeSortName={handleSortChange}
              clearSort={clearSort}
            />
            <Title
              sorted
              title='Business Plan'
              style={styles.businessPlanColumn}
              sortType={sortNumbers[3]}
              sortName='group'
              sortIndex={3}
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
                    businessModel={item.businessModel.title}
                    businessPlan={item.companyName}
                    deletePlan={deletePlan}
                  />
                  {index !== plansData.length - 1 && <CustomDivider />}
                </Fragment>
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
