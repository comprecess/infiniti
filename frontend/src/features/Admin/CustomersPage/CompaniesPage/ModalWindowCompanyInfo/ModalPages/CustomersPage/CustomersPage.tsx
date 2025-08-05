import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CustomersViewCompany,
  RolesAccess,
} from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/get-company-page'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import styles from './CustomersPage.module.scss'
import { Item } from './Item/Item'

interface CustomersPageProps {
  id: number
  roles?: { [key: string]: RolesAccess }
}

export const CustomersPage = ({ id, roles }: CustomersPageProps) => {
  const [customers, setCustomers] = useState<
  CustomersViewCompany[] | null
  >(null)

  const navigate = useNavigate()

  const getCustomers = async () => {
    const response = await getCompanyPage(id, 'customers')

    if (!response.status) return

    setCustomers(response.data.data)
  }

  const handleNavigate = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${id}/${Routes.summary}`,
    )
  }

  const handleNavigateToCreateCustomer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.add}/${Routes.customer}?for-company=${id}`,
    )
  }

  useEffect(() => {
    getCustomers()
  }, [])

  return (
    <div className={styles.wrapper}>
      {roles && roles.customers.create === 0 ? (
        <div />
      ) : (
        <ButtonBlue
          title='Add Customer'
          style={styles.buttonBlue}
          styleTitle={styles.buttonBlueTitle}
          onClick={handleNavigateToCreateCustomer}
        />
      )}
      <div className={styles.container}>
        {customers ? (
          <div className={styles.table}>
            <div className={styles.columns}>
              <Title title='#' style={styles.hashTagColumn} />
              <Title title='Name' style={styles.nameColumn} />
              <Title title='Email' style={styles.emailColumn} />
              <Title title='Phone' style={styles.phoneColumn} />
            </div>
            <div className={styles.items}>
              {customers.map((item, index) => {
                return (
                  <Fragment key={item.id}>
                    <Item
                      code={item.id}
                      name={item.account}
                      email={item.email}
                      phone={item.phone}
                      onClick={handleNavigate}
                    />
                    {index !== customers.length - 1 && <CustomDivider />}
                  </Fragment>
                )
              })}
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}
