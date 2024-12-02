import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  SalesNewInvoiceFormData,
  SalesNewInvoiceInputData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
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
  const navigate = useNavigate()

  const getNewInvoiceInputData = async () => {
    const getResponse = await getInvoiceInputData()

    setInputData(getResponse)
  }

  const postCreateNewInvoice = async (save: 'save' | 'save & invoice') => {
    if (!formData) return

    const createResponse = await addNewInvoice(formData)

    if (createResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created an Invoice',
        status: 'success',
      })
      if (save === 'save') {
        navigate(
          `/${Routes.adminPages}/${Routes.sales}/${Routes.invoices}`,
        )
      } else if (save === 'save & invoice') {
        navigate(
          `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${createResponse.id}`,
        )
      }
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
            componentProps={{
              firstButtonClick: postCreateNewInvoice,
              secondButtonClick: postCreateNewInvoice,
            }}
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
