import { useState } from 'react'

import styles from './Item.module.scss'
import { ProjectsViewTaskTimeSpentData } from '../../../../../../../app/constants/constants'
import { ConfirmationModal } from '../../../../../../../shared/ui/ConfirmationModal/ConfirmationModal'
import { CustomMiniButton } from '../../../../../../../shared/ui/CustomMiniButton/CustomMiniButton'
import { TimeModal } from '../../TimeModal/TimeModal'
import styleItem from '../TimeSpentTable.module.scss'

interface ItemProps {
  data: ProjectsViewTaskTimeSpentData
  idTask: number
  refreshList: () => void
  deleteTimeSpent: (idTime: number) => void
}

export const Item = ({ data, idTask, refreshList, deleteTimeSpent }: ItemProps) => {
  const [modalDelete, setModalDelete] = useState<boolean>(false)
  const [addTimeModal, setAddTimeModal] = useState<boolean>(false)

  const handleOpenConfirmationModal = () => {
    setModalDelete(state => !state)
  }

  const handleSetAddTimeModal = () => {
    setAddTimeModal(prev => !prev)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={`${styleItem.avatarColumn} ${styles.avatarItem}`}>
          <div className={styles.avatar}>
            <img
              alt='Avatar'
              src={
                data.user.img
                  ? `${data.user.img}?width=128&height=128`
                  : '/profileWithoutAvatar.svg'
              }
            />
          </div>
        </div>
        <div className={`${styleItem.accountColumn} ${styles.accountItem}`}>
          {data.user.account}
        </div>
        <div className={`${styleItem.timeColumn} ${styles.timeItem}`}>
          {`${data.date} / ${data.time}`}
        </div>
        <div className={`${styleItem.descriptionColumn} ${styles.descriptionItem}`}>
          {data.description}
        </div>
        <div className={`${styleItem.manageColumn} ${styles.manageItem}`}>
          <CustomMiniButton
            style='amber'
            icon='/icons/edit.svg'
            alt='Edit'
            tooltipTitle='Edit'
            onClick={handleSetAddTimeModal}
          />
          <CustomMiniButton
            style='cherry'
            icon='/icons/trash.svg'
            alt='Delete'
            tooltipTitle='Delete'
            onClick={handleOpenConfirmationModal}
          />
        </div>
      </div>
      {modalDelete && (
        <ConfirmationModal
          isOpened={modalDelete}
          handleOpenCloseModal={handleOpenConfirmationModal}
          agree={() => deleteTimeSpent(data.id)}
        />
      )}
      {addTimeModal && (
        <TimeModal
          title='Edit Time'
          data={data}
          idTask={idTask}
          isOpened={addTimeModal}
          refreshList={refreshList}
          handleOpenCloseModal={handleSetAddTimeModal}
        />
      )}
    </>
  )
}
