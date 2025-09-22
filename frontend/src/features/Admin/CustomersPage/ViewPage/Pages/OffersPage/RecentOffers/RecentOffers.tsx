import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { Item } from './Item/Item'
import styles from './RecentOffers.module.scss'
import {
  RolesAccess,
  ViewOffersTypeData,
} from '../../../../../../../app/constants/constants'
import { Routes } from '../../../../../../../app/router/routes'
import { CustomDivider } from '../../../../../../../shared/ui/CustomDivider/CustomDivider'
import { Title } from '../../../../../../Main/RecentCard/Title/Title'

interface RecentOffersProps {
  access: RolesAccess | undefined
  list: ViewOffersTypeData[]
}

export const RecentOffers = ({ access, list }: RecentOffersProps) => {
  const navigate = useNavigate()

  const navigateToViewOffer = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.offer}/${Routes.view}/${id}`,
    )
  }

  const navigateToEditOffer = (id: number) => {
    navigate(
      `/${Routes.adminPages}/${Routes.sales}/${Routes.edit}/${Routes.offer}/${id}`,
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <Title title='#' style={styles.codeColumn} />
        <Title title='Subject' style={styles.subjectColumn} />
        <Title title='Amount' style={styles.amountColumn} />
        <Title title='Date Created' style={styles.dateCreatedColumn} />
        <Title title='Expiry Date' style={styles.dateExpiryColumn} />
        <Title title='Stage' style={styles.stageColumn} />
        <Title title='Manage' style={styles.manageColumn} />
      </div>
      <div className={styles.items}>
        {list.map((item, index) => {
          return (
            <Fragment key={item.id}>
              <Item
                access={access}
                item={item}
                navigateToViewOffer={navigateToViewOffer}
                navigateToEditOffer={navigateToEditOffer}
              />
              {index !== list.length - 1 && <CustomDivider />}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
