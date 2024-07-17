import { FC, useEffect } from 'react'

import { CompaniesListData } from '../../../../app/data/admin/companiesList'
import { PagesList } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/PagesList/PagesList'
import { RecentCompanies } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/RecentCompanies'
import { SearchAndButtons } from '../../../../features/Admin/CustomersPage/CompaniesPage/RecentCompanies/SearchAndButtons/SearchAndButtons'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './CompaniesPage.module.scss'

export const AdminCompaniesPage: FC = () => {
  useEffect(() => {
    document.title = 'infiniti | Companies'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {CompaniesListData ? (
          <RecentCard
            title='Companies'
            style={styles.recentFullScreen}
            HeaderComponent={SearchAndButtons}
            PagesComponent={PagesList}
            Component={ButtonBlue}
            componentProps={{
              title: 'New Company',
              titleNone: true,
              icon: '/icons/plus.svg',
              iconProps: styles.icon,
              style: styles.blueButton,
            }}
          >
            <RecentCompanies companiesList={CompaniesListData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
