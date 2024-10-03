import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SalesViewOfferData } from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Buttons } from '../../../../features/Admin/Sales/ViewOfferPage/Buttons/Buttons'
import { Footer } from '../../../../features/Admin/Sales/ViewOfferPage/Footer/Footer'
import { Header } from '../../../../features/Admin/Sales/ViewOfferPage/Header/Header'
import { RecentOffers } from '../../../../features/Admin/Sales/ViewOfferPage/RecentOffers/RecentOffers'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoSelectedOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/GetInfoSelectedOffer'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewOfferPage.module.scss'

const extractIdFromUrl = (url: string): number | null => {
  const regex = /\/view\/(\d+)$/
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

export const AdminViewOfferPage: FC = () => {
  const [info, setInfo] = useState<SalesViewOfferData | null>(null)

  const id = useIdFromUrl()
  const navigate = useNavigate()

  const getOfferInfo = async () => {
    if (id === null) return

    const getResponse = await getInfoSelectedOffer(id, '?type=view')

    setInfo(getResponse)
  }

  const navigateToEditOffer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.offer}/${info?.id}`,
    )
  }

  const navigateToPreviewOffer = () => {
    const url = `/${Routes.public}/${Routes.offer}/${Routes.view}/${info?.token}`

    window.open(url, '_blank')
  }

  useEffect(() => {
    getOfferInfo()
  }, [id])

  return (
    <div className={styles.wrapper}>
      {info ? (
        <section className={styles.section}>
          <CustomInput
            readOnly
            title='Unique Offer URL:'
            type='text'
            name='uniqueURL'
            id='uniqueURL'
            styleInput={styles.input}
            value={`${import.meta.env.VITE_MAIN_DOMAIN}/${Routes.public}/${
              Routes.offer
            }/${Routes.view}/${info.token}`}
            onChange={() => {}}
          />
          <RecentCard
            title='Offer'
            HeaderComponent={Header}
            Component={Buttons}
            PagesComponent={Footer}
            componentProps={{
              stageList: info.listStage.filter(
                stage => stage !== info.stage,
              ),
              previewOffer: navigateToPreviewOffer,
              editOffer: navigateToEditOffer,
            }}
            pagesProps={{
              subtotal: info.blankCalc.price,
              tax: info.blankCalc.tax,
              discount: info.blankCalc.discount,
              grandTotal: info.blankCalc.total,
              note: info.notes,
            }}
            headerProps={{
              subject: info.subject,
              offerCode: info.code,
              dateCreated: info.dateCreated,
              validUntil: info.validUntil,
              stage: info.stage,
              company: info.company,
              totalOffer: info.blankCalc.total,
              client: info.client,
              proposal: info.proposal,
              notes: info.notes,
            }}
          >
            <RecentOffers blankList={info.blank} />
          </RecentCard>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
