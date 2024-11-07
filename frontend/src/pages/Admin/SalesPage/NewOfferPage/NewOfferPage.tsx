import { FC, useEffect, useState } from 'react'

import { SalesOfferInputData } from '../../../../app/constants/constants'
import {
  Fields,
  PartialFieldsNewOfferData,
} from '../../../../features/Admin/Sales/NewOfferPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
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

  const getNewOfferInputData = async () => {
    const getResponse = await getOfferInputData()

    setInputData(getResponse)
  }

  const postCreateNewInvoice = async () => {
    if (!formData) return

    const createResponse = await addNewOffer(formData)

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
            Component={ButtonBlue}
            componentProps={{
              titleNone: true,
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              onClick: postCreateNewInvoice,
              style: styles.buttonSave,
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
