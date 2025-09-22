import { useEffect, useState } from 'react'

import styles from './AddCustomerPage.module.scss'
import { HeaderButtons } from './HeaderButtons/HeaderButtons'
import { CustomerInputsData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/CustomersPage/AddCustomer/Fields'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCustomerInputsData } from '../../../../shared/utils/api/Admin/AddCustomer/get-customer-input-data'
import { loadStorage } from '../../../../shared/utils/Saving/Storage/LoadStorage'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminAddCustomerPage = () => {
  const [data, setData] = useState<CustomerInputsData | null>(null)

  const urlParams = new URLSearchParams(window.location.search)
  const companyIdParam = urlParams.get('for-company')
  const companyId = companyIdParam !== null ? parseInt(companyIdParam) : null

  const storageKey = 'createCustomerForm'

  const getInputsData = async () => {
    const response = await getCustomerInputsData()

    if (!response.status) return

    setData(response.data)
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
            title='Add Customer'
            style={styles.recentFullScreen}
            Component={HeaderButtons}
            componentProps={{
              storageKey,
              isClearButton: loadStorage(storageKey) ? true : false,
            }}
          >
            <Fields data={data} companyId={companyId} storageKey={storageKey} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
