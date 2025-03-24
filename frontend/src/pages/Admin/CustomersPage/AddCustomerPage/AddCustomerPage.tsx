import { useEffect, useState } from 'react'

import { CustomerInputsData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/CustomersPage/AddCustomer/Fields'
import { ImportButton } from '../../../../features/Admin/CustomersPage/AddCustomer/ImportButton/ImportButton'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../shared/utils/api/Admin/AddCustomer/GetCustomerInputsData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AddCustomerPage.module.scss'

export const AdminAddCustomerPage = () => {
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
            Component={ImportButton}
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
