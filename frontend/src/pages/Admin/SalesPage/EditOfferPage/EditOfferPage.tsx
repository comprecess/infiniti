import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './EditOfferPage.module.scss'
import {
  SalesBlanks,
  SalesEditInvoiceBlankData,
  SalesEditOfferData,
  SalesOfferInputData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsPostData,
} from '../../../../features/Admin/Sales/EditOffer/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { deleteBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/delete-blank-offer'
import { getListBlanksOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/get-list-blanks-offer'
import { getSelectedInfoOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/get-selected-info-offer'
import { postAddNewBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/post-add-new-blank-offer'
import { postAddNewServiceBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/post-add-new-service-blank-offer'
import { putUpdateBlankOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/put-update-blank-offer'
import { putUpdateOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/put-update-offer'
import { getOfferInputData } from '../../../../shared/utils/api/Admin/Sales/NewOffer/get-offer-input-data'
import { useIdFromUrl } from '../../../../shared/utils/usefulMethods'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminEditOfferPage = () => {
  const [formData, setFormData] = useState<PartialFieldsPostData>({})
  const [data, setData] = useState<SalesEditOfferData | null>(null)
  const [inputData, setInputData] = useState<SalesOfferInputData | null>(null)
  const [blanks, setBlanks] = useState<SalesBlanks | null>(null)

  const id = useIdFromUrl('offer')
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getInfoOffer = async () => {
    if (id === null) return

    const response = await getSelectedInfoOffer(id)

    if (!response.status) return

    setData(response.data)
  }

  const getNewOfferInputData = async () => {
    const response = await getOfferInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const getBlanksOffer = async () => {
    if (id === null) return

    const response = await getListBlanksOffer(id)

    if (!response.status) return

    setBlanks(response.data)
  }

  const updateOffer = async () => {
    if (id === null) return

    const { status, message } = await putUpdateOffer(id, formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Offer',
        status: 'success',
      })
      navigate(`/${Routes.adminPages}/${Routes.sales}/${Routes.offers}`)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleRemoveBlank = async (idBlank: number) => {
    if (id === null) return

    const { status, message } = await deleteBlankOffer(id, idBlank)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully deleted blank',
        status: 'success',
      })
      getBlanksOffer()
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleUpdateBlank = async (idBlank: number, data: SalesEditInvoiceBlankData) => {
    if (id === null) return

    const { status } = await putUpdateBlankOffer(id, idBlank, data)

    if (status) {
      getBlanksOffer()
    }
  }

  const handleAddBlank = async () => {
    if (id === null) return

    const { status, message } = await postAddNewBlankOffer(id, 'calc')

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added blank',
        status: 'success',
      })
      getBlanksOffer()
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

    const { status, message } = await postAddNewServiceBlankOffer(id, 'serviceProduct', idService)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully added blank',
        status: 'success',
      })
      getBlanksOffer()
    } else {
      showToast({
        title: 'Error',
        description: message,
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
              onClick: updateOffer,
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
