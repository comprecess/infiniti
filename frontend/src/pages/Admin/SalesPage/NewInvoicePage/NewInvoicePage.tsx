import { FC, useEffect, useState } from 'react'

import { SalesNewInvoiceInputData } from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/Sales/NewInvoice/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewInvoice/HeaderButtons/HeaderButtons'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInvoiceInputData } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/GetInvoiceInputData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewInvoicePage.module.scss'

export const AdminNewInvoicePage: FC = () => {
  const [inputData, setInputData] =
    useState<SalesNewInvoiceInputData | null>(null)

  const getNewInvoiceInputData = async () => {
    const getResponse = await getInvoiceInputData()

    setInputData(getResponse)
  }

  useEffect(() => {
    document.title = 'infiniti | New Invoices'
  }, [])

  useEffect(() => {
    getNewInvoiceInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData ? (
          <RecentCard
            title={`${inputData.invoiceNum}${inputData.num}`}
            style={styles.recentFullScreen}
            Component={HeaderButtons}
          >
            <Fields data={inputData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
