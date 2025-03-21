import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import styles from './NewGroup.module.scss'

interface NewGroupProps {
  modalNewGroup: boolean
  handleOpenCloseModal: () => void
  handleInputChange: (name: string, value: string | number) => void
  createNewGroup: () => void
}

export const NewGroup = ({
  modalNewGroup,
  handleOpenCloseModal,
  handleInputChange,
  createNewGroup,
}: NewGroupProps) => {
  return (
    <CustomModalWindow
      maxWidth={'400px'}
      isOpen={modalNewGroup}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.input}>
        <div className={styles.header}>
          <h4 className={styles.title}>Add New Group</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.inputDescription}>
          <CustomInput
            title='Group Name'
            type='text'
            id='groupName'
            name='groupName'
            onChange={handleInputChange}
          />
        </div>
        <ButtonBlue title='Add' onClick={createNewGroup} />
      </div>
    </CustomModalWindow>
  )
}
