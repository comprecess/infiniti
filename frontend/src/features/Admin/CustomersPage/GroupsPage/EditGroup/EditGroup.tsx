import { FC } from 'react'

import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './EditGroup.module.scss'

interface EditGroupProps {
  id: number
  inputValueName: string
  modalEditGroup: boolean
  handleOpenCloseModal: () => void
  editGroup: (id: number) => void
  handleInputChange: (name: string, value: string) => void
}

export const EditGroup: FC<EditGroupProps> = ({
  id,
  inputValueName,
  modalEditGroup,
  handleOpenCloseModal,
  editGroup,
  handleInputChange,
}) => {
  const handleEditGroup = () => {
    editGroup(id)
  }

  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={modalEditGroup}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Edit Group</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.inputDescription}>
          <CustomInput
            title='New Group Name'
            type='text'
            id='groupName'
            name='groupName'
            value={inputValueName}
            onChange={handleInputChange}
          />
        </div>
        <ButtonBlue title='Save' onClick={handleEditGroup} />
      </div>
    </CustomModalWindow>
  )
}
