import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './CartToOfferPage.module.scss'
import { SalesEditOfferData, SalesOfferInputData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import {
  Fields,
  PartialFieldsCartToOfferData,
} from '../../../../features/Admin/TalentsPage/CartToOfferPage/Fields/Fields'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getOfferInputData } from '../../../../shared/utils/api/Admin/Sales/NewOffer/get-offer-input-data'
import { postCreateNewOffer } from '../../../../shared/utils/api/Admin/Sales/NewOffer/post-create-new-offer'
import { getOfferCartInfo } from '../../../../shared/utils/api/Admin/Talents/Cart/get-offer-cart-info'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'

const extractParamsFromUrl = (url: string): { idCart: number | null; token: string | null } => {
  const regex = /\/cart\/(\d+)\/to\/offer\/([a-fA-F0-9]+)$/
  const match = url.match(regex)

  return match ? { idCart: parseInt(match[1], 10), token: match[2] } : { idCart: null, token: null }
}

const useParamsFromUrl = () => {
  const location = useLocation()

  return useMemo(() => extractParamsFromUrl(location.pathname), [location.pathname])
}

export const AdminCartToOfferPage = () => {
  const [formData, setFormData] = useState<PartialFieldsCartToOfferData>({})
  const [data, setData] = useState<SalesEditOfferData | null>(null)
  const [inputData, setInputData] = useState<SalesOfferInputData | null>(null)

  const { idCart, token } = useParamsFromUrl()

  const navigate = useNavigate()
  const showToast = useCustomToast()

  const getInfoOffer = async () => {
    if (token === null) return

    const response = await getOfferCartInfo(token)

    if (!response.status) return

    setData(response.data.data)
  }

  const getNewOfferInputData = async () => {
    const response = await getOfferInputData()

    if (!response.status) return

    setInputData(response.data)
  }

  const createNewOffer = async () => {
    if (idCart === null) return

    const { status, message } = await postCreateNewOffer(formData)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully created an offer',
        status: 'success',
      })
      setTimeout(() => {
        navigate(`/${Routes.adminPages}/${Routes.sales}/${Routes.offers}`)
      }, 250)
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | Create Offer'
  }, [])

  useEffect(() => {
    if (idCart !== null) {
      getNewOfferInputData()
      getInfoOffer()
    }
  }, [idCart])

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        {inputData && data ? (
          <RecentCard
            title={`${inputData.offerNum}${inputData.num}`}
            style={styles.recentFullScreen}
            Component={ButtonBlue}
            componentProps={{
              title: 'Save',
              icon: '/icons/fileWhite.svg',
              iconProps: styles.buttonSaveIcon,
              onClick: createNewOffer,
            }}
          >
            <Fields
              data={data}
              token={token}
              inputData={inputData}
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
