import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  SalesEditInvoiceData,
  SalesNewInvoiceInputData,
} from '../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsData,
} from '../../../../features/Admin/Sales/EditInvoice/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewInvoice/HeaderButtons/HeaderButtons'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { editSelectedInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/EditSelectedInvoice'
import { getInfoSelectedInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/GetInfoSelectedInvoice'
import { getInvoiceInputData } from '../../../../shared/utils/api/Admin/Sales/NewInvoice/GetInvoiceInputData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditInvoice.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/editinvoice\/(\d+)$/
  const match = url.match(regex)

  return match ? parseInt(match[1], 10) : null
}

const useIdFromUrl = () => {
  const location = useLocation()

  const id = useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )

  return id
}

export const AdminEditInvoice: FC = () => {
  const [data, setData] = useState<SalesEditInvoiceData | null>(null)
  const [formData, setFormData] = useState<PartialFieldsData>({})
  const [inputData, setInputData] = useState<SalesNewInvoiceInputData | null>(
    null,
  )

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const getInfoInvoice = async () => {
    if (id === null) return

    const getInfo = await getInfoSelectedInvoice(id)

    setData(getInfo)
  }

  const getNewInvoiceInputData = async () => {
    const getResponse = await getInvoiceInputData()

    setInputData(getResponse)
  }

  const updateInvoice = async () => {
    if (id === null) return

    const updateResponse = await editSelectedInvoice(id, formData)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted Invoice',
        status: 'success',
      })
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    getNewInvoiceInputData()
    getInfoInvoice()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData && data ? (
          <RecentCard
            title={data.code}
            style={styles.recentFullScreen}
            Component={HeaderButtons}
            componentProps={{ firstButtonClick: updateInvoice }}
          >
            <Fields
              inputData={inputData}
              data={data}
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
