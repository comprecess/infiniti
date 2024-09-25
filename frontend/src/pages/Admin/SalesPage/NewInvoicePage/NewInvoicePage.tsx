import { FC, useEffect, useState } from 'react'

import {
  SalesNewInvoiceFormData,
  SalesNewInvoiceInputData,
} from '../../../../app/constants/constants'
import { Fields } from '../../../../features/Admin/Sales/NewInvoice/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewInvoice/HeaderButtons/HeaderButtons'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInvoiceInputData } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/GetInvoiceInputData'
import { addNewInvoice } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/PostCreateNewInvoice'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewInvoicePage.module.scss'

export const AdminNewInvoicePage: FC = () => {
  const [formData, setFormData] = useState<
  Partial<SalesNewInvoiceFormData>
  >({})
  const [inputData, setInputData] =
    useState<SalesNewInvoiceInputData | null>(null)

  const showToast = useCustomToast()

  const getNewInvoiceInputData = async () => {
    const getResponse = await getInvoiceInputData()

    setInputData(getResponse)
  }

  const postCreateNewInvoice = async () => {
    if (!formData) return

    const createResponse = await addNewInvoice(formData)

    if (createResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created an Invoice',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: createResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | New Invoice'
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
            componentProps={{ firstButtonClick: postCreateNewInvoice }}
          >
            <Fields data={inputData} onFormDataChange={setFormData} />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
