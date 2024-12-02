import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SalesOfferInputData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsNewOfferData,
} from '../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { HeaderButtons } from '../../../../features/Admin/Sales/NewOfferPage/HeadersButton/HeaderButtons'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getOfferInputData } from '../../../../shared/utils/api/Admin/Sales/NewOffer/GetOfferInputData'
import { addNewOffer } from '../../../../shared/utils/api/Admin/Sales/NewOffer/PostCreateNewOffer'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './NewOfferPage.module.scss'

export const AdminNewOfferPage: FC = () => {
  const [formData, setFormData] = useState<
  Partial<PartialFieldsNewOfferData>
  >({})
  const [inputData, setInputData] = useState<SalesOfferInputData | null>(
    null,
  )

  const showToast = useCustomToast()
  const navigate = useNavigate()

  const getNewOfferInputData = async () => {
    const getResponse = await getOfferInputData()

    setInputData(getResponse)
  }

  const postCreateNewOffer = async (save: 'save' | 'save & invoice') => {
    if (!formData) return

    const createResponse = await addNewOffer(formData)

    if (createResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created an Invoice',
        status: 'success',
      })
      if (save === 'save') {
        navigate(`/${Routes.adminPages}/${Routes.sales}/${Routes.offers}`)
      } else if (save === 'save & invoice') {
        navigate(
          `/${Routes.adminPages}/${Routes.sales}/${Routes.offer}/${Routes.view}/${createResponse.id}`,
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
              firstButtonClick: postCreateNewOffer,
              secondButtonClick: postCreateNewOffer,
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
