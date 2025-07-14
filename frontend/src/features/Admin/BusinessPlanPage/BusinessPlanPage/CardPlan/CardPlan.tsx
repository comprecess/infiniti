import { useState } from 'react'

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
  picture: string
  viewBusinessPlan: (id: number) => void
  editBusinessPlan: (id: number) => void
  deleteBusinessPlan: (id: number) => void
}

export const CardPlan = ({
  access,
  idCard,
  title,
  description,
  picture,
  viewBusinessPlan,
  editBusinessPlan,
  deleteBusinessPlan,
}: CardPlanProps) => {
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
        <img
          src={picture ?? '/businessPlan.jpeg'}
          alt='Logo'
          className={styles.logo}
        />
        <div className={styles.content}>
          <div className={styles.texts}>
            <span className={styles.title}>{title}</span>
            <span
              dangerouslySetInnerHTML={{ __html: safeHTML }}
              className={styles.description}
            />
          </div>
          <div className={styles.miniButtons}>
            {access.view === 1 && (
              <CustomMiniButton
                style='mint'
                icon='/icons/view.svg'
                alt='View'
                tooltipTitle='View'
                onClick={handleNavigateViewBusinessPlan}
              />
            )}
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
