import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  SalesOfferEmailTemplateData,
  SalesViewOfferData,
} from '../../../../app/constants/constants'
import { Routes } from '../../../../app/router/routes'
import { Buttons } from '../../../../features/Admin/Sales/ViewOfferPage/Buttons/Buttons'
import { EmailPanel } from '../../../../features/Admin/Sales/ViewOfferPage/EmailPanel/EmailPanel'
import { Footer } from '../../../../features/Admin/Sales/ViewOfferPage/Footer/Footer'
import { Header } from '../../../../features/Admin/Sales/ViewOfferPage/Header/Header'
import { RecentOffers } from '../../../../features/Admin/Sales/ViewOfferPage/RecentOffers/RecentOffers'
import { ConfirmationModal } from '../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { useCustomToast } from '../../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoSelectedOffer } from '../../../../shared/utils/api/Admin/Sales/EditOffer/GetInfoSelectedOffer'
import { convertOfferToInvoice } from '../../../../shared/utils/api/Admin/Sales/Offers/ConvertToInvoice'
import { getOfferEmailTemplate } from '../../../../shared/utils/api/Admin/Sales/Offers/GetOfferEmailTemplates'
import { changeOfferStage } from '../../../../shared/utils/api/Admin/Sales/Offers/OfferChangeStage'
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

  const [emailInfo, setEmailInfo] =
    useState<SalesOfferEmailTemplateData | null>(null)
  const [emailTemplate, setEmailTemplate] = useState<string>('')
  const [emailPanel, setEmailPanel] = useState<boolean>(false)

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false)

  const id = useIdFromUrl()
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const openCloseEmailPanel = () => {
    setEmailPanel(!emailPanel)
  }

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen)
  }

  const setTemplateEmail = async (template: 'offer-create') => {
    if (template === null || id === null) return

    const getResponse = await getOfferEmailTemplate(id, template)

    setEmailTemplate(template)
    setEmailInfo(getResponse)
  }

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

  const handleInteractPDF = async (name: string) => {
    if (!info?.pdf) return

    if (name === 'View PDF') {
      const response = await fetch(info.pdf)

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        window.open(url, '_blank')

        URL.revokeObjectURL(url)
      }
    } else if (name === 'Download PDF') {
      const a = document.createElement('a')

      a.href = info.pdf
      a.download = 'Offer.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleChangeStage = async (stage: string) => {
    if (id === null) return

    const changeResponse = await changeOfferStage(id, stage)

    if (changeResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed the Offer stage',
        status: 'success',
      })
      getOfferInfo()
    } else {
      showToast({
        title: 'Error',
        description: changeResponse.message,
        status: 'error',
      })
    }
  }

  const convertToInvoice = async () => {
    if (id === null) return

    const convertResponse = await convertOfferToInvoice(id)

    if (convertResponse.status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully converted Offer to Invoice',
        status: 'success',
      })
      openConfirmationModal()
    } else {
      showToast({
        title: 'Error',
        description: convertResponse.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'infiniti | View Offer'
  }, [])

  useEffect(() => {
    if (emailInfo && emailTemplate) {
      openCloseEmailPanel()
    }
  }, [emailInfo, emailTemplate])

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
              selectPDF: handleInteractPDF,
              selectStage: handleChangeStage,
              convertToInvoice: openConfirmationModal,
              email: setTemplateEmail,
            }}
            pagesProps={{
              subtotal: info.blankCalc.price,
              tax: info.blankCalc.tax,
              discount: info.blankCalc.discount,
              grandTotal: info.blankCalc.total,
              notes: info.notes,
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
      {emailInfo && (
        <EmailPanel
          info={emailInfo}
          modalEmailPanel={emailPanel}
          handleOpenCloseModal={openCloseEmailPanel}
          idOffer={id}
          template={emailTemplate}
        />
      )}
      <ConfirmationModal
        title='Are you sure you want to convert Invoice to Offer?'
        isOpened={isConfirmationModalOpen}
        handleOpenCloseModal={openConfirmationModal}
        agree={convertToInvoice}
      />
    </div>
  )
}
