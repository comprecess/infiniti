import { useEffect, useState } from 'react'
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
import { getInvoiceInputData } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/get-invoice-input-data'
import { postCreateNewInvoice } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/post-create-new-invoice'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewInvoicePage.module.scss'

export const AdminNewInvoicePage = () => {
  const [formData, setFormData] = useState<
  Partial<SalesNewInvoiceFormData>
  >({})
  const [inputData, setInputData] =
    useState<SalesNewInvoiceInputData | null>(null)

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const urlParams = new URLSearchParams(window.location.search)
  const isCreateForProject = urlParams.has('create-for-project')
  const projectId = urlParams.get('create-for-project')
  const customerIdParam = urlParams.get('for-customer')
  const customerId =
    customerIdParam !== null ? parseInt(customerIdParam) : null

  const getNewInvoiceInputData = async () => {
    const response = await getInvoiceInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const createNewInvoice = async (save: 'save' | 'save & invoice') => {
    if (!formData) return

    const { status, message, id } = await postCreateNewInvoice(
      isCreateForProject
        ? `${
          import.meta.env.VITE_RESIDENT_PROJECTS_API
        }/${projectId}/invoices`
        : import.meta.env.VITE_SALES_CREATE_NEW_INVOICE,
      formData,
    )

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created an Invoice',
        status: 'success',
      })
      if (save === 'save') {
        if (isCreateForProject) {
          navigate(
            `/${Routes.adminPages}/${Routes.projects}/${Routes.view}/${Routes.project}/${projectId}/${Routes.invoices}`,
          )
        } else {
          navigate(
            `/${Routes.adminPages}/${Routes.sales}/${Routes.invoices}?filterStatus=Unpaid`,
          )
        }
      } else if (save === 'save & invoice') {
        navigate(
          `/${Routes.adminPages}/${Routes.sales}/${Routes.invoice}/${Routes.view}/${id}`,
        )
      }
    } else {
      showToast({
        title: 'Error',
        description: message,
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
              firstButtonClick: () => createNewInvoice('save'),
              secondButtonClick: () => createNewInvoice('save & invoice'),
            }}
          >
            <Fields
              data={inputData}
              customerId={customerId}
              onFormDataChange={setFormData}
            />
          </RecentCard>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </section>
    </div>
  )
}
