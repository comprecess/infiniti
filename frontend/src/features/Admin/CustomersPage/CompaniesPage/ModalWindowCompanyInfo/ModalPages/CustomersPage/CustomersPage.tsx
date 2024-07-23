import React, { FC, useEffect, useState } from 'react'

import { CustomersViewCompany } from '../../../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/GetPage'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import styles from './CustomersPage.module.scss'
import { Item } from './Item/Item'

interface CustomersPageProps {
  id: number
}

export const CustomersPage: FC<CustomersPageProps> = ({ id }) => {
  const [customers, setCustomers] = useState<
  CustomersViewCompany[] | null
  >(null)

  const getCustomers = async () => {
    const getResponse = await getPage(id, 'customers')

    setCustomers(getResponse.data)
  }

  useEffect(() => {
    getCustomers()
  }, [])

  return (
    <div className={styles.wrapper}>
      <ButtonBlue
        title='Add Customer'
        style={styles.buttonBlue}
        styleTitle={styles.buttonBlueTitle}
      />
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
                  <React.Fragment key={item.id}>
                    <Item
                      id={item.id}
                      name={item.account}
                      email={item.email}
                      phone={item.phone}
                    />
                    {index !== customers.length - 1 && <CustomDivider />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  )
}
