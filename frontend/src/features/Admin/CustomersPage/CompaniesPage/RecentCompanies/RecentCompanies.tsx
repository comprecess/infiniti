import React, { FC } from 'react'

import { CompaniesListProps } from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './RecentCompanies.module.scss'

interface RecentCompaniesProps {
  companiesList: CompaniesListProps[]
}

export const RecentCompanies: FC<RecentCompaniesProps> = ({
  companiesList,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='Logo' style={styles.logoColumn} />
        <Title title='Company Name' style={styles.companyNameColumn} />
        <Title title='Email' style={styles.emailColumn} />
        <Title title='Phone' style={styles.phoneColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {companiesList.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <Item
                logo={item.logo}
                name={item.name}
                email={item.email}
                phone={item.phone}
              />
              {index !== companiesList.length - 1 && <CustomDivider />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
