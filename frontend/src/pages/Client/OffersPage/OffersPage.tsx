import { useEffect, useState } from 'react'

import styles from './OffersPage.module.scss'
import { ClientOfferData } from '../../../app/constants/constants'
import { RecentTotal } from '../../../features/Client/OffersPage/RecentTotal/RecentTotal'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInvoiceOrOffer } from '../../../shared/utils/api/Client/get-invoice-or-offer'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'

export const ClientOffersPage = () => {
  const [offers, setOffers] = useState<ClientOfferData[] | null>(null)

  const getOfferList = async () => {
    const response = await getInvoiceOrOffer('offer')

    if (!response.status) return

    setOffers(response.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Offers'

    getOfferList()
  }, [])

  return (
    <div className={styles.wrapper}>
      {offers ? (
        <section className={styles.section}>
          <RecentCard title={`Total: ${offers.length}`} style={styles.recentFullScreen}>
            <RecentTotal offers={offers} />
          </RecentCard>
        </section>
      ) : (
        <div className={styles.loading}>
          <LoadingSpinner size='xl' />
        </div>
      )}
    </div>
  )
}
