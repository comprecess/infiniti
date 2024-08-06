import { FC, useEffect, useState } from 'react'

import { CustomerInputsData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/CustomersPage/AddCustomer/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../shared/utils/api/Admin/AddCustomer/GetCustomerInputsData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AddCustomerPage.module.scss'

export const AdminAddCustomerPage: FC = () => {
  const [data, setData] = useState<CustomerInputsData | null>(null)

  const getInputsData = async () => {
    const getResponse = await getCustomerInputsData()

    setData(getResponse)
  }

  useEffect(() => {
    getInputsData()
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Add Customer'
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {data ? (
          <RecentCard
            title='Add Contact'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'Import Conatcts',
              style: styles.blueButton,
              icon: '/icons/import.svg',
              iconProps: styles.icon,
              titleNone: true,
            }}
          >
            <Fields data={data} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
