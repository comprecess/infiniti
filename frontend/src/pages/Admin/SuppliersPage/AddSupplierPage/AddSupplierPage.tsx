import { useEffect, useState } from 'react'

import styles from './AddSupplierPage.module.scss'
import { CustomerInputsData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/AddSupplierPage/Fields/Fields'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../shared/utils/api/Admin/AddCustomer/get-customer-input-data'
import { loadStorage } from '../../../../shared/utils/Saving/Storage/LoadStorage'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import { HeaderButtons } from '../../CustomersPage/AddCustomerPage/HeaderButtons/HeaderButtons'

export const AdminAddSupplierPage = () => {
  const [data, setData] = useState<CustomerInputsData | null>(null)

  const storageKey = 'createSupplierForm'

  const getInputsData = async () => {
    const response = await getCustomerInputsData('/?type=Supplier')

    if (!response.status) return

    setData(response.data)
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
            title='Add Supplier'
            style={styles.recentFullScreen}
            Component={HeaderButtons}
            componentProps={{
              storageKey,
              isClearButton: loadStorage(storageKey) ? true : false,
            }}
          >
            <Fields data={data} storageKey={storageKey} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
