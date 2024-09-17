import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  SalesBlanks,
  SalesEditInvoiceBlankData,
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
import { addBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/AddBlank'
import { addServiceBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/AddServiceBlank'
import { editSelectedInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/EditSelectedInvoice'
import { getBlanksListInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/GetBlanks'
import { getInfoSelectedInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/GetInfoSelectedInvoice'
import { removeBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/RemoveBlank'
import { updateBlankInvoice } from '../../../../shared/utils/api/Admin/Sales/EditInvoice/UpdateBlank'
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

  return useMemo(
    () => extractIdFromUrl(location.pathname),
    [location.pathname],
  )
}

export const AdminEditInvoice: FC = () => {
  const [data, setData] = useState<SalesEditInvoiceData | null>(null)
  const [formData, setFormData] = useState<PartialFieldsData>({})
  const [inputData, setInputData] =
    useState<SalesNewInvoiceInputData | null>(null)
  const [blanks, setBlanks] = useState<SalesBlanks | null>(null)

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const getInfoInvoice = async () => {
    if (id === null) return

    const getInfo = await getInfoSelectedInvoice(id)

    setData(getInfo)
  }

  const getBlanksInvoice = async () => {
    if (id === null) return

    const getBlanks = await getBlanksListInvoice(id)

    setBlanks(getBlanks)
  }

  const getNewInvoiceInputData = async () => {
    const getResponse = await getInvoiceInputData()

    setInputData(getResponse)
  }

  const handleAddBlank = async () => {
    if (id === null) return

    const addResponse = await addBlankInvoice(id, 'calc')

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

  const handleAddServiceBlank = async (idService: string) => {
    if (id === null) return

    const addResponse = await addServiceBlankInvoice(
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

    const removeResponse = await removeBlankInvoice(id, idBlank)

    if (removeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted blank',
        status: 'success',
      })
      getBlanksInvoice()
    } else {
      showToast({
        title: 'Error',
        description: removeResponse.message,
        status: 'error',
      })
    }
  }

  const handleUpdateBlank = async (
    idBlank: number,
    data: SalesEditInvoiceBlankData,
  ) => {
    if (id === null) return

    const updateResponse = await updateBlankInvoice(id, idBlank, data)

    if (updateResponse.status) {
      getBlanksInvoice()
    }
  }

  const updateInvoice = async () => {
    if (id === null) return

    const updateResponse = await editSelectedInvoice(id, formData)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Invoice',
        status: 'success',
      })
      getBlanksInvoice()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
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
            componentProps={{ firstButtonClick: updateInvoice }}
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
