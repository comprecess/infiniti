import { Fragment } from 'react'

import { Item } from './Item/Item'
import styles from './RecentCompanies.module.scss'
import {
  CompaniesListProps,
  RolesAccess,
} from '../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../Main/RecentCard/Title/Title'

interface RecentCompaniesProps {
  access: RolesAccess
  companiesList: CompaniesListProps[]
  deleteCompany: (id: number) => void
  editCompany: (id: number, type: 'view' | 'edit') => void
  infoCompany: (id: number) => void
}

export const RecentCompanies = ({
  access,
  companiesList,
  deleteCompany,
  editCompany,
  infoCompany,
}: RecentCompaniesProps) => {
  return (
    <div className={styles.wrapper}>
      {companiesList.length > 0 ? (
        <>
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
                <Fragment key={item.id}>
                  <Item
                    id={item.id}
                    access={access}
                    logo={item.logo}
                    code={item.code}
                    name={item.name}
                    email={item.email}
                    phone={item.phone}
                    deleteCompany={deleteCompany}
                    editCompany={editCompany}
                    infoCompany={infoCompany}
                  />
                  {index !== companiesList.length - 1 && <CustomDivider />}
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
