import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  SalesBlanks,
  SalesEditInvoiceBlankData,
  SalesEditOfferData,
  SalesOfferInputData,
} from '../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/Sales/EditOffer/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { addBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/AddBlankOffer'
import { addServiceBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/AddServiceBlankOffer'
import { editSelectedOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/EditSelectedOffer'
import { getBlanksListOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/GetBlanksOffer'
import { getInfoSelectedOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/GetInfoSelectedOffer'
import { removeBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/RemoveBlankOffer'
import { updateBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/UpdateBlankOffer'
import { getOfferInputData } from '../../../../shared/utils/api/Admin/Sales/NewOffer/GetOfferInputData'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './EditOfferPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/offer\/(\d+)$/
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

export const AdminEditOfferPage: FC = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})
  const [data, setData] = useState<SalesEditOfferData | null>(null)
  const [inputData, setInputData] = useState<SalesOfferInputData | null>(
    null,
  )
  const [blanks, setBlanks] = useState<SalesBlanks | null>(null)

  const id = useIdFromUrl()
  const showToast = useCustomToast()

  const getInfoOffer = async () => {
    if (id === null) return

    const getInfo = await getInfoSelectedOffer(id)

    setData(getInfo)
  }

  const getNewOfferInputData = async () => {
    const getResponse = await getOfferInputData()

    setInputData(getResponse)
  }

  const getBlanksOffer = async () => {
    if (id === null) return

    const getBlanks = await getBlanksListOffer(id)

    setBlanks(getBlanks)
  }

  const updateInvoice = async () => {
    if (id === null) return

    const updateResponse = await editSelectedOffer(id, formData)

    if (updateResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Offer',
        status: 'success',
      })
      getBlanksOffer()
    } else {
      showToast({
        title: 'Error',
        description: updateResponse.message,
        status: 'error',
      })
    }
  }

  const handleRemoveBlank = async (idBlank: number) => {
    if (id === null) return

    const removeResponse = await removeBlankOffer(id, idBlank)

    if (removeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted blank',
        status: 'success',
      })
      getBlanksOffer()
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

    const updateResponse = await updateBlankOffer(id, idBlank, data)

    if (updateResponse.status) {
      getBlanksOffer()
    }
  }

  const handleAddBlank = async () => {
    if (id === null) return

    const addResponse = await addBlankOffer(id, 'calc')

    if (addResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added blank',
        status: 'success',
      })
      getBlanksOffer()
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

    const addResponse = await addServiceBlankOffer(
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
      getBlanksOffer()
    } else {
      showToast({
        title: 'Error',
        description: addResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Edit Offer'
  }, [])

  useEffect(() => {
    if (id !== null) {
      getNewOfferInputData()
      getInfoOffer()
      getBlanksOffer()
    }
  }, [id])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData && data && blanks ? (
          <RecentCard
            title='Edit Offer'
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              onClick: updateInvoice,
              style: styles.buttonSave,
            }}
          >
            <Fields
              data={data}
              blanks={blanks}
              inputData={inputData}
              addBlank={handleAddBlank}
              addServiceBlank={handleAddServiceBlank}
              updateBlank={handleUpdateBlank}
              removeBlank={handleRemoveBlank}
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
