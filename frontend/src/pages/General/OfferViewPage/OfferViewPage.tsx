import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import styles from './OfferViewPage.module.scss'
import { SalesViewOfferData } from '../../../app/constants/constants'
import { RecentOffers } from '../../../features/Admin/Sales/ViewOfferPage/RecentOffers/RecentOffers'
import { DeclineOfferModal } from '../../../features/General/OfferViewPage/DeclineOfferModal/DeclineOfferModal'
import { Footer } from '../../../features/General/OfferViewPage/Footer/Footer'
import { Header } from '../../../features/General/OfferViewPage/Header/Header'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { useCustomToast } from '../../../shared/ui/CustomToast/CustomToast'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoPublicOffer } from '../../../shared/utils/api/Admin/Sales/PublicOffer/GetInfoPublicOffer'
import { postAcceptOrDecline } from '../../../shared/utils/api/Admin/Sales/PublicOffer/PostAcceptOrDecline'
import { getAuthToken } from '../../../shared/utils/api/get-auth-token'

const extractTokenFromUrl = (url: string): string | null => {
  const regex = /\/view\/([^/]+)$/
  const match = url.match(regex)

  return match ? match[1] : null
}

const useTokenFromUrl = () => {
  const location = useLocation()

  return useMemo(
    () => extractTokenFromUrl(location.pathname),
    [location.pathname],
  )
}

export const OfferViewPage = () => {
  const [info, setInfo] = useState<SalesViewOfferData | null>(null)

  const [declineModal, setDeclineModal] = useState<boolean>(false)

  const token = useTokenFromUrl()
  const authToken = getAuthToken()
  const showToast = useCustomToast()

  const changeStateDeclineModal = () => {
    setDeclineModal(state => !state)
  }

  const getOfferInfo = async () => {
    if (token === null) return

    const getResponse = await getInfoPublicOffer(token, '?type=view')

    setInfo(getResponse)
  }

  const viewPDF = async () => {
    if (!info?.pdf) return

    const response = await fetch(info.pdf)

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      URL.revokeObjectURL(url)
    }
  }

  const downloadPDF = () => {
    if (!info?.pdf) return

    const a = document.createElement('a')

    a.href = info.pdf
    a.download = 'Offer.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleAcceptOrDeclineOffer = async (
    stage: 'Accepted' | 'Decline',
    message?: string,
  ) => {
    if (token === null) return

    const response = await postAcceptOrDecline(
      token,
      stage,
      message,
      authToken,
    )

    if (response.status) {
      showToast({
        title: 'Successfully',
        description:
          stage === 'Accepted'
            ? 'You have successfully Accepted the Offer'
            : 'You have successfully Declined the offer',
        status: 'success',
      })
      getOfferInfo()
      if (stage === 'Decline') {
        changeStateDeclineModal()
      }
    } else {
      showToast({
        title: 'Error',
        description: response.message,
        status: 'error',
      })
    }
  }

  useEffect(() => {
    document.title = 'Infiniti | Public Offer'
  }, [])

  useEffect(() => {
    getOfferInfo()
  }, [token])

  return (
    <>
      <div className={styles.wrapper}>
        {info ? (
          <div className={styles.container}>
            <div className={styles.pdfButtons}>
              <ButtonBlue
                title='Download PDF'
                style={styles.downloadPDF}
                onClick={downloadPDF}
              />
              <ButtonBlue
                title='View PDF'
                style={styles.viewPDF}
                onClick={viewPDF}
              />
              {info.status.publicButton && (
                <>
                  <ButtonBlue
                    title='Accept'
                    style={styles.acceptPDF}
                    onClick={() => {
                      handleAcceptOrDeclineOffer('Accepted')
                    }}
                  />
                  <ButtonBlue
                    title='Decline'
                    style={styles.declinePDF}
                    onClick={changeStateDeclineModal}
                  />
                </>
              )}
            </div>
            <div className={styles.header}>
              <Header
                title={info.subject}
                code={info.code}
                dateCreated={info.dateCreated}
                expiryDate={info.validUntil}
                stage={info.stage}
                total={info.blankCalc.total}
                client={info.client}
                checkPublic={info.checkPublic === 1 ? true : false}
                proposal={info.proposal}
                company={{
                  companyAddress: info.company.companyAddress,
                  companyName: info.company.companyName,
                }}
              />
            </div>
            <div className={styles.table}>
              <div className={styles.tableContent}>
                <RecentOffers blankList={info.blank} />
              </div>
            </div>
            <div className={styles.footer}>
              <Footer
                subtotal={info.blankCalc.price}
                tax={info.blankCalc.tax}
                discount={info.blankCalc.discount}
                grandTotal={info.blankCalc.total}
                notes={info.notes}
              />
            </div>
          </div>
        ) : (
          <LoadingSpinner size='xl' />
        )}
      </div>
      {declineModal && (
        <DeclineOfferModal
          modalDecline={declineModal}
          handleOpenCloseModal={changeStateDeclineModal}
          decline={handleAcceptOrDeclineOffer}
        />
      )}
    </>
  )
}
