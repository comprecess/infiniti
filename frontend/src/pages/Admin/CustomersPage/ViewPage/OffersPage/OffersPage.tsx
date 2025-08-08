import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { ViewPageContext } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { RecentOffers } from '../../../../../features/Admin/CustomersPage/ViewPage/Pages/OffersPage/RecentOffers/RecentOffers'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { LoadingSpinner } from '../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getSelectedTypeInfo } from '../../../../../shared/utils/api/Admin/ViewContact/get-selected-type-info'
import { RecentCard } from '../../../../../widgets/RecentCard/RecentCard'
import styles from './OffersPage.module.scss'

export const AdminContactOffersPage = () => {
  const context = useOutletContext<ViewPageContext>()
  const navigate = useNavigate()

  const { data: offers } = useQuery({
    queryKey: ['offers', context.idClient],
    queryFn: async () => {
      const response = await getSelectedTypeInfo(
        context.idClient,
        'quotes',
      )

      if (!response.status) return

      return response.data
    },
    placeholderData: previousData => previousData,
  })

  const navigateToCreateNewOffer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.new}/${Routes.offer}?for-customer=${context.idClient}`,
    )
  }

  useEffect(() => {
    document.title = 'infiniti | Contact | Offers'
  }, [])

  return (
    <div className={styles.wrapper}>
      {offers ? (
        <RecentCard
          HeaderComponent={ButtonBlue}
          headerProps={{
            title: 'New Offer',
            style: styles.headerButton,
            onClick: navigateToCreateNewOffer,
          }}
        >
          <RecentOffers access={offers.access} list={offers.data} />
        </RecentCard>
      ) : (
        <LoadingSpinner size='xl' />
      )}
    </div>
  )
}
