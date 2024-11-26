import { FC, useState } from 'react'

import { ConfirmationModal } from '../../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { sanitizeMessage } from '../../../../../../../../shared/utils/TextEditor/sanitizeMessage'
import { IconItem } from '../IconItem/IconItem'
import styles from './Item.module.scss'

interface ItemProps {
  id: number
  account: string
  date: string
  dateTime: string
  noDelete: number
  icon: string
  message: string
  time: string
  deleteSelectedActivity: (idType: number) => void
  editActivity: (idType: number, icon: string, message: string) => void
}

export const Item: FC<ItemProps> = ({
  id,
  account,
  date,
  dateTime,
  noDelete,
  icon,
  message,
  time,
  editActivity,
  deleteSelectedActivity,
}) => {
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
                className={styles.message}
              />
              {noDelete === 0 && (
                <div className={styles.buttonsList}>
                  <button
                    className={styles.buttonEdit}
                    onClick={handleClickEdit}
                  >
                    <img
                      src='/icons/edit.svg'
                      alt='Edit'
                      className={styles.icon}
                    />
                  </button>
                  <button
                    className={styles.buttonTrash}
                    onClick={handleOpenConfirmationModal}
                  >
                    <img
                      src='/icons/trash.svg'
                      alt='Trash'
                      className={styles.icon}
                    />
                  </button>
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
