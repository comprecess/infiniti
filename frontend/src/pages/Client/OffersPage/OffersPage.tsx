import { FC, useEffect, useState } from 'react'

import { ClientOfferData } from '../../../app/constants/constants'
import { RecentTotal } from '../../../features/Client/OffersPage/RecentTotal/RecentTotal'
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getInvoiceOrOffer } from '../../../shared/utils/api/Client/GetInvoiceOrOffer'
import { RecentCard } from '../../../widgets/RecentCard/RecentCard'
import styles from './OffersPage.module.scss'

export const ClientOffersPage: FC = () => {
  const [offers, setOffers] = useState<ClientOfferData[] | null>(null)

  const getOfferList = async () => {
    const getResponse = await getInvoiceOrOffer('offer')

    setOffers(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Offers'

    getOfferList()
  }, [])

  return (
    <div className={styles.wrapper}>
      {offers ? (
        <section className={styles.section}>
          <RecentCard
            title={`Total: ${offers.length}`}
            style={styles.recentFullScreen}
          >
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
