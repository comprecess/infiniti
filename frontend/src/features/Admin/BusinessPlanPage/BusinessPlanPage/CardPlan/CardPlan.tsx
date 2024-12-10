import { FC, useState } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { sanitizeMessage } from '../../../../../shared/utils/TextEditor/sanitizeMessage'
import styles from './CardPlan.module.scss'

interface CardPlanProps {
  access: RolesAccess
  idCard: number
  title: string
  description: string
  viewBusinessPlan: (id: number) => void
  editBusinessPlan: (id: number) => void
  deleteBusinessPlan: (id: number) => void
}

export const CardPlan: FC<CardPlanProps> = ({
  access,
  idCard,
  title,
  description,
  viewBusinessPlan,
  editBusinessPlan,
  deleteBusinessPlan,
}) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const safeHTML = sanitizeMessage(description)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleNavigateViewBusinessPlan = () => {
    viewBusinessPlan(idCard)
  }

  const handleNavigateEditBusinessPlan = () => {
    editBusinessPlan(idCard)
  }

  const handleDeletePlan = () => {
    deleteBusinessPlan(idCard)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <img src='/bp.jpeg' alt='Logo' className={styles.logo} />
        <div className={styles.content}>
          <div className={styles.texts}>
            <span className={styles.title}>{title}</span>
            <div
              dangerouslySetInnerHTML={{ __html: safeHTML }}
              className={styles.description}
            />
          </div>
          <div className={styles.miniButtons}>
            {access.view && (
              <CustomMiniButton
                style='mint'
                icon='/icons/view.svg'
                alt='View'
                tooltipTitle='View'
                onClick={handleNavigateViewBusinessPlan}
              />
            )}
            {access.edit && (
              <CustomMiniButton
                style='amber'
                icon='/icons/edit.svg'
                alt='Edit'
                tooltipTitle='Edit'
                onClick={handleNavigateEditBusinessPlan}
              />
            )}
            {access.edit && (
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
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleDeletePlan}
        />
      )}
    </>
  )
}
