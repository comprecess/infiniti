import { FC, useState } from 'react'

import { Buttons } from '../../../../features/Admin/Sales/ViewOfferPage/Buttons/Buttons'
import { Footer } from '../../../../features/Admin/Sales/ViewOfferPage/Footer/Footer'
import { Header } from '../../../../features/Admin/Sales/ViewOfferPage/Header/Header'
import { RecentOffers } from '../../../../features/Admin/Sales/ViewOfferPage/RecentOffers/RecentOffers'
import { CustomInput } from '../../../../shared/ui/CustomInput/CustomInput'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { RecentCard } from '../../../../widgets/RecentCard/RecentCard'
import styles from './ViewOfferPage.module.scss'

export const AdminViewOfferPage: FC = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [info, _setInfo] = useState<null>(null)

  return (
    <div className={styles.wrapper}>
      {!info ? (
        <section className={styles.section}>
          <CustomInput
            readOnly
            title='Unique Offer URL:'
            type='text'
            name='uniqueURL'
            id='uniqueURL'
            styleInput={styles.input}
            value={`---token---`}
            onChange={() => {}}
          />
          <RecentCard
            title='Offer'
            HeaderComponent={Header}
            Component={Buttons}
            PagesComponent={Footer}
          >
            <RecentOffers />
          </RecentCard>
        </section>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
