import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { OrdersViewCompany } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/get-company-page'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './OrdersPage.module.scss'

interface OrdersPageProps {
  id: number
}

export const OrdersPage = ({ id }: OrdersPageProps) => {
  const [orders, setOrders] = useState<OrdersViewCompany[] | null>(null)

  const navigate = useNavigate()

  const getOrders = async () => {
    const response = await getCompanyPage(id, 'orders')

    if (!response.status) return

    setOrders(response.data.data)
  }

  const handleNavigate = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${id}/${Routes.summary}`,
    )
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
                  <Fragment key={item.id}>
                    <Item
                      id={item.client.id}
                      orderNum={item.orderNum}
                      dateAdded={item.dateAdded}
                      account={item.account}
                      amount={item.amount}
                      status={item.status}
                      onClick={handleNavigate}
                    />
                    {index !== orders.length - 1 && <CustomDivider />}
                  </Fragment>
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
