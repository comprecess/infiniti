import { useEffect, useState } from 'react'

import { CustomerInputsData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/AddSupplierPage/Fields/Fields'
import { ImportButton } from '../../../../features/Admin/CustomersPage/AddCustomer/ImportButton/ImportButton'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../shared/utils/api/Admin/AddCustomer/GetCustomerInputsData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './AddSupplierPage.module.scss'

export const AdminAddSupplierPage = () => {
  const [data, setData] = useState<CustomerInputsData | null>(null)

  const getInputsData = async () => {
    const getResponse = await getCustomerInputsData('/?type=Supplier')

    setData(getResponse)
  }

  useEffect(() => {
    getInputsData()
  }, [])

  useEffect(() => {
    document.title = 'infiniti | Add Supplier'
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
