import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './NewOfferPage.module.scss'
import { SalesOfferInputData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsNewOfferData,
} from '../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewOfferPage/HeadersButton/HeaderButtons'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getOfferInputData } from '../../../../shared/utils/api/Admin/Sales/NewOffer/get-offer-input-data'
import { postCreateNewOffer } from '../../../../shared/utils/api/Admin/Sales/NewOffer/post-create-new-offer'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

export const AdminNewOfferPage = () => {
  const [formData, setFormData] = useState<
  Partial<PartialFieldsNewOfferData>
  >({})
  const [inputData, setInputData] = useState<SalesOfferInputData | null>(
    null,
  )

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const urlParams = new URLSearchParams(window.location.search)
  const customerIdParam = urlParams.get('for-customer')
  const customerId =
    customerIdParam !== null ? parseInt(customerIdParam) : null

  const getNewOfferInputData = async () => {
    const response = await getOfferInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const createNewOffer = async (save: 'save' | 'save & invoice') => {
    if (!formData) return

    const { status, message, id } = await postCreateNewOffer(formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created an Invoice',
        status: 'success',
      })
      if (save === 'save') {
        navigate(`/${Routes.adminPages}/${Routes.sales}/${Routes.offers}`)
      } else if (save === 'save & invoice') {
        navigate(
          `/${Routes.adminPages}/${Routes.sales}/${Routes.offer}/${Routes.view}/${id}`,
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
    document.title = 'infiniti | New Offer'
  }, [])

  useEffect(() => {
    getNewOfferInputData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData ? (
          <RecentCard
            title={`${inputData.offerNum}${inputData.num}`}
            style={styles.recentFullScreen}
            Component={HeaderButtons}
            componentProps={{
              firstButtonClick: createNewOffer,
              secondButtonClick: createNewOffer,
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
