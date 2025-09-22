import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { Routes } from '../../../../../app/router/routes'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import styleItem from '../RecentPlans.module.scss'

interface ItemProps {
  access: RolesAccess
  id: number
  idClient: number
  image: string
  name: string
  code: string
  businessModel: string
  businessPlan: string
  token: string
  deletePlan: (id: number) => void
}

export const Item = ({
  access,
  id,
  idClient,
  image,
  name,
  code,
  businessModel,
  businessPlan,
  token,
  deletePlan,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateToCustomer = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.customers}/${Routes.view}/${idClient}/summary`,
    )
  }

  const handleNavigateViewBusinessPlan = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.view}/${Routes.businessPlan}/${id}`,
    )
  }

  const handleNavigateEditBusinessPlan = () => {
    navigate(
      `/${Routes.adminPages}/${Routes.businessPlan}/${Routes.edit}/${Routes.businessPlan}/${id}`,
    )
  }

  const handleNavigateToPreview = () => {
    const url = `/${Routes.public}/${Routes.view}/${Routes.businessPlan}/${token}`

    window.open(url, '_blank')
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styleItem.imageColumn}>
          <div className={styles.avatar}>
            <img
              alt='Avatar'
              src={
                image
                  ? `${image}?width=128&height=128`
                  : '/profileWithoutAvatar.svg'
              }
            />
          </div>
        </div>
        <div
          className={`${styleItem.nameColumn} ${styles.nameCodeItem}`}
          onClick={handleNavigateToCustomer}
        >
          <span className={styles.nameItem}>{name}</span>
          <span className={styles.codeItem}>{code}</span>
        </div>
        <span
          className={`${styleItem.businessModelColumn} ${styles.businessModelItem}`}
        >
          {businessModel}
        </span>
        <span
          className={`${styleItem.businessPlanColumn} ${styles.businessPlanItem}`}
        >
          {businessPlan}
        </span>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          {access.view === 1 && (
            <CustomMiniButton
              style='mint'
              icon='/icons/view.svg'
              alt='View'
              tooltipTitle='View'
              onClick={handleNavigateViewBusinessPlan}
            />
          )}
          <CustomMiniButton
            style='gray'
            icon='/icons/fileWhite.svg'
            alt='Preview'
            tooltipTitle='Preview'
            onClick={handleNavigateToPreview}
          />
          {access.edit === 1 && (
            <CustomMiniButton
              style='amber'
              icon='/icons/edit.svg'
              alt='Edit'
              tooltipTitle='Edit'
              onClick={handleNavigateEditBusinessPlan}
            />
          )}
          {access.delete === 1 && (
            <CustomMiniButton
              style='cherry'
              icon='/icons/trash.svg'
              alt='Delete'
              tooltipTitle='Delete'
              onClick={handleOpenConfirmationModal}
            />
          )}
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={() => deletePlan(id)}
        />
      )}
    </>
  )
}
