import { useState } from 'react'

import styles from './NewCategoryModal.module.scss'
import { CrossIcon } from '../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomInput } from '../../../../../../shared/ui/CustomInput/CustomInput'
import { CustomModalWindow } from '../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'

interface NewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  addNewCategory: (name: string) => void
}

export const NewCategoryModal = ({
  isOpen,
  onClose,
  addNewCategory,
}: NewCategoryModalProps) => {
  const [name, setName] = useState<string>('')

  const handleAddNewCategory = () => {
    addNewCategory(name)
    onClose()
  }

  return (
    <CustomModalWindow maxWidth='500px' isOpen={isOpen} onClose={onClose}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Add New Category</h4>
          <div className={styles.cross} onClick={onClose}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.inputDescription}>
          <CustomInput
            title='Category Name'
            type='text'
            id='name'
            name='name'
            onChange={(_name, value) => setName(value as string)}
          />
        </div>
        <ButtonBlue title='Add' onClick={handleAddNewCategory} />
      </div>
    </CustomModalWindow>
  )
}
