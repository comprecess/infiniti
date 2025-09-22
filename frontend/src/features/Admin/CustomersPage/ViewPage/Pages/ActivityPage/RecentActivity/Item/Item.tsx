import { useState } from 'react'

import styles from './Item.module.scss'
import { RolesAccess } from '../../../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { sanitizeMessage } from '../../../../../../../../shared/utils/TextEditor/sanitizeMessage'
import { IconItem } from '../IconItem/IconItem'

interface ItemProps {
  id: number
  account: string
  date: string
  dateTime: string
  noDelete: number
  icon: string
  message: string
  time: string
  access: RolesAccess
  deleteSelectedActivity: (idType: number) => void
  editActivity: (idType: number, icon: string, message: string) => void
}

export const Item = ({
  id,
  account,
  date,
  dateTime,
  noDelete,
  icon,
  message,
  time,
  access,
  editActivity,
  deleteSelectedActivity,
}: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)

  const safeHTML = sanitizeMessage(message)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleClickEdit = () => {
    editActivity(id, icon, message)
  }

  const handleClickDelete = () => {
    deleteSelectedActivity(id)
    handleOpenConfirmationModal()
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.wrapperContainer}>
          <div className={styles.container}>
            <div className={styles.leftContainer}>
              <IconItem nameIcon={icon} />
              <div className={styles.dateTime}>
                <span className={styles.date}>{date}</span>
                <span className={styles.time}>{dateTime}</span>
                <span className={styles.time}>{time}</span>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <span className={styles.account}>{account}</span>
              <div
                dangerouslySetInnerHTML={{ __html: safeHTML }}
                className='dangerouslySetInnerHTML'
              />
              {noDelete === 0 && access.edit === 1 && (
                <div className={styles.buttonsList}>
                  <CustomMiniButton
                    style='mint'
                    icon='/icons/edit.svg'
                    alt='Edit'
                    tooltipTitle='Edit'
                    onClick={handleClickEdit}
                  />
                  <CustomMiniButton
                    style='cherry'
                    icon='/icons/trash.svg'
                    alt='Delete'
                    tooltipTitle='Delete'
                    onClick={handleOpenConfirmationModal}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={handleClickDelete}
        />
      )}
    </>
  )
}
