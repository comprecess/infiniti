import React, { FC, useEffect, useState } from 'react'

import { OrdersViewCompany } from '../../../../../../../app/constants/constants'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/GetPage'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './OrdersPage.module.scss'

interface OrdersPageProps {
  id: number
}

export const OrdersPage: FC<OrdersPageProps> = ({ id }) => {
  const [orders, setOrders] = useState<OrdersViewCompany[] | null>(null)

  const getOrders = async () => {
    const getResponse = await getPage(id, 'orders')

    setOrders(getResponse.data)
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {orders ? (
          <div className={styles.table}>
            <div className={styles.columns}>
              <Title title='Order #' style={styles.hashTagColumn} />
              <Title title='Date' style={styles.dateColumn} />
              <Title title='Customer' style={styles.customerColumn} />
              <Title title='Total' style={styles.totalColumn} />
              <Title title='Status' style={styles.statusColumn} />
            </div>
            <div className={styles.items}>
              {orders.map((item, index) => {
                return (
                  <React.Fragment key={item.id}>
                    <Item
                      id={item.id}
                      orderNum={item.orderNum}
                      dateAdded={item.dateAdded}
                      account={item.account}
                      amount={item.amount}
                      status={item.status}
                    />
                    {index !== orders.length - 1 && <CustomDivider />}
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
