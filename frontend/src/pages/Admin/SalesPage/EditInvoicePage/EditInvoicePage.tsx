import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  SalesBlanks,
  SalesEditInvoiceBlankData,
  SalesEditInvoiceData,
  SalesNewInvoiceInputData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsData,
} from '../../../../features/Admin/Sales/EditInvoice/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewInvoice/HeaderButtons/HeaderButtons'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/delete-blank-invoice'
import { getListBlanksInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/get-list-blanks-invoice'
import { getSelectedInfoInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/get-selected-info-invoice'
import { postAddNewBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/post-add-new-blank-invoice'
import { postAddNewServiceBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/post-add-new-service-blank-invoice'
import { putUpdateBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/put-update-blank-invoice'
import { putUpdateInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/put-update-invoice'
import { getInvoiceInputData } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/GetInvoiceInputData'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditInvoicePage.module.scss'

export const AdminEditInvoicePage = () => {
  const [formData, setFormData] = useState<PartialFieldsData>({})
  const [data, setData] = useState<SalesEditInvoiceData | null>(null)
  const [inputData, setInputData] =
    useState<SalesNewInvoiceInputData | null>(null)
  const [blanks, setBlanks] = useState<SalesBlanks | null>(null)

  const id = useIdFromUrl('invoice')
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInfoInvoice = async () => {
    if (id === null) return

    const response = await getSelectedInfoInvoice(id)

    if (!response.status) return

    setData(response.data)
  }

  const getBlanksInvoice = async () => {
    if (id === null) return

    const response = await getListBlanksInvoice(id)

    if (!response.status) return

    setBlanks(response.data)
  }

  const getNewInvoiceInputData = async () => {
    const getResponse = await getInvoiceInputData()

    setInputData(getResponse)
  }

  const handleAddBlank = async () => {
    if (id === null) return

    const { status, message } = await postAddNewBlankInvoice(id, 'calc')

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added blank',
        status: 'success',
      })
      getBlanksInvoice()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleAddServiceBlank = async (idService: string) => {
    if (id === null) return

    const addResponse = await postAddNewServiceBlankInvoice(
      id,
      'serviceProduct',
      idService,
    )

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added blank',
        status: 'success',
      })
      getBlanksInvoice()
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  const handleRemoveBlank = async (idBlank: number) => {
    if (id === null) return

    const { status, message } = await deleteBlankInvoice(id, idBlank)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted blank',
        status: 'success',
      })
      getBlanksInvoice()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleUpdateBlank = async (
    idBlank: number,
    data: SalesEditInvoiceBlankData,
  ) => {
    if (id === null) return

    const { status } = await putUpdateBlankInvoice(id, idBlank, data)

    if (status) {
      getBlanksInvoice()
    }
  }

  const updateInvoice = async (save: 'save' | 'save & invoice') => {
    if (id === null) return

    const { status, message } = await putUpdateInvoice(id, formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Invoice',
        status: 'success',
      })
      if (save === 'save') {
        navigate(
          `/${Routes.adminPages}/${Routes.sales}/${Routes.invoices}?filterStatus=Unpaid`,
        )
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
    if (id !== null) {
      getNewInvoiceInputData()
      getInfoInvoice()
      getBlanksInvoice()
    }
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData && data && blanks ? (
          <RecentCard
            title={data.code}
            style={styles.recentFullScreen}
            Component={HeaderButtons}
            componentProps={{
              firstButtonClick: updateInvoice,
              secondButtonClick: updateInvoice,
            }}
          >
            <Fields
              inputData={inputData}
              blanks={blanks}
              data={data}
              addBlank={handleAddBlank}
              addServiceBlank={handleAddServiceBlank}
              removeBlank={handleRemoveBlank}
              updateBlank={handleUpdateBlank}
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
