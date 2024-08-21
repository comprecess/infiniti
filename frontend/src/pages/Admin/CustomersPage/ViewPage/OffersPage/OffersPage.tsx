import { FC, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  ViewOffersTypeData,
  ViewPageContext,
} from '../../../../../app/constants/constants'
import { RecentOffers } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/OffersPage/RecentOffers/RecentOffers'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/GetSelectedTypeInfo'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './OffersPage.module.scss'

export const AdminContactOffersPage: FC = () => {
  const [data, setData] = useState<ViewOffersTypeData[] | null>(null)

  const context = useOutletContext<ViewPageContext>()

  const getInfo = async () => {
    const getResponse = await getSelectedTypeInfo(
      context.idClient,
      'quotes',
    )

    setData(getResponse.data)
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Offers'
  }, [])

  useEffect(() => {
    getInfo()
  }, [context.idClient])

  return (
    <div className={styles.wrapper}>
      {data ? (
        <RecentCard
          HeaderComponent={ButtonBlue}
          headerProps={{
            title: 'Create New Offer',
            style: styles.headerButton,
          }}
        >
          <RecentOffers list={data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
