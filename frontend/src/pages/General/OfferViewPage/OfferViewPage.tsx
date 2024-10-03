import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { SalesViewOfferData } from '../../../app/constants/constants'
import { RecentOffers } from '../../../features/Admin/Sales/ViewOfferPage/RecentOffers/RecentOffers'
import { Footer } from '../../../features/General/OfferViewPage/Footer/Footer'
import { Header } from '../../../features/General/OfferViewPage/Header/Header'
import { ButtonBlue } from '../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInfoPublicOffer } from '../../../shared/utils/api/Admin/Sales/PublicOffer/GetInfoPublicOffer'
import styles from './OfferViewPage.module.scss'

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

export const OfferViewPage: FC = () => {
  const [info, setInfo] = useState<SalesViewOfferData | null>(null)

  const token = useTokenFromUrl()

  const getOfferInfo = async () => {
    if (token === null) return

    const getResponse = await getInfoPublicOffer(token, '?type=view')

    setInfo(getResponse)
  }

  useEffect(() => {
    getOfferInfo()
  }, [token])

  return (
    <div className={styles.wrapper}>
      {info ? (
        <div className={styles.container}>
          <div className={styles.pdfButtons}>
            <ButtonBlue title='Download PDF' style={styles.downloadPDF} />
            <ButtonBlue title='View PDF' style={styles.viewPDF} />
            <ButtonBlue title='Accept' style={styles.acceptPDF} />
            <ButtonBlue title='Decline' style={styles.declinePDF} />
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
              notes={info.notes}
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
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
