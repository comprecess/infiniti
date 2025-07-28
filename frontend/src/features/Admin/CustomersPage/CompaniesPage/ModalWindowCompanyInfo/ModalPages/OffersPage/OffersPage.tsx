import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { OffersViewCompany } from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { LoadingSpinner } from '../../../../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { getCompanyPage } from '../../../../../../../shared/utils/api/Admin/Companies/View/get-company-page'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'
import { Item } from './Item/Item'
import styles from './OffersPage.module.scss'

interface OffersPageProps {
  id: number
}

export const OffersPage = ({ id }: OffersPageProps) => {
  const [offers, setOffers] = useState<OffersViewCompany[] | null>(null)

  const navigate = useNavigate()

  const getOffers = async () => {
    const response = await getCompanyPage(id, 'quotes')

    if (!response.status) return

    setOffers(response.data.data)
  }

  const handleNavigate = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${id}/${Routes.summary}`,
    )
  }

  useEffect(() => {
    getOffers()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {offers ? (
          <div className={styles.table}>
            <div className={styles.columns}>
              <Title title='#' style={styles.hashTagColumn} />
              <Title title='Customer' style={styles.customerColumn} />
              <Title title='Subject' style={styles.subjectColumn} />
              <Title title='Amount' style={styles.amountColumn} />
              <Title
                title='Date Created'
                style={styles.dateCreatedColumn}
              />
              <Title title='Expiry Date' style={styles.expiryDateColumn} />
              <Title title='Stage' style={styles.stageColumn} />
              <Title title='Manage' style={styles.manageColumn} />
            </div>
            <div className={styles.items}>
              {offers.map((item, index) => {
                return (
                  <Fragment key={item.id}>
                    <Item
                      id={item.client.id}
                      idOffer={item.id}
                      code={item.id}
                      account={item.account}
                      subject={item.code}
                      total={item.total}
                      dateCreated={item.dateCreated}
                      validUntil={item.validUntil}
                      stage={item.stage}
                      onClick={handleNavigate}
                    />
                    {index !== offers.length - 1 && <CustomDivider />}
                  </Fragment>
                )
              })}
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}
