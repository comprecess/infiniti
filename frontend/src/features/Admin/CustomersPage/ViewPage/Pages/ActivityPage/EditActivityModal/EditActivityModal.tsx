import { FC, useEffect, useState } from 'react'

import { IconsListData } from '../../../../../../../app/data/textEditorIcons'
import { CrossIcon } from '../../../../../../../shared/icons/CrossIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomModalWindow } from '../../../../../../../shared/ui/CustomModalWindow/CustomModalWindow'
import { TextEditor } from '../../../../../../../shared/ui/TextEditor/TextEditor'
import { Item } from '../TextEditorWrapper/Item/Item'
import styles from './EditActivityModal.module.scss'

interface EditActivityModalProps {
  icon: string | undefined
  message: string | undefined
  modalEditActivity: boolean
  handleOpenCloseModal: () => void
  saveInfo: (icon: string, message: string) => void
}

export const EditActivityModal: FC<EditActivityModalProps> = ({
  icon,
  message,
  modalEditActivity,
  handleOpenCloseModal,
  saveInfo,
}) => {
  const [value, setValue] = useState<string>('')
  const [image, setImage] = useState<string>('')

  const updateInfo = () => {
    saveInfo(image, value)
    handleOpenCloseModal()
  }

  const changeIcon = (nameIcon: string) => {
    setImage(nameIcon)
  }

  useEffect(() => {
    setValue(message || '')
    setImage(icon || '')
  }, [message, icon])

  return (
    <CustomModalWindow
      maxWidth={'800px'}
      isOpen={modalEditActivity}
      onClose={handleOpenCloseModal}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h4 className={styles.title}>Edit</h4>
          <div className={styles.cross} onClick={handleOpenCloseModal}>
            <CrossIcon />
          </div>
        </div>
        <div className={styles.container}>
          <TextEditor defaultValue={value} setValue={setValue} />
          <div className={styles.iconListWrapper}>
            <div className={styles.iconsList}>
              {IconsListData.map(item => {
                return (
                  <Item
                    key={item.id}
                    iconComponent={item.icon}
                    nameIcon={item.nameIcon}
                    isActive={image === item.nameIcon}
                    isStroke={item.stroke}
                    onClick={changeIcon}
                  />
                )
              })}
            </div>
          </div>
          <ButtonBlue
            title='Save'
            style={styles.buttonBlue}
            onClick={updateInfo}
          />
        </div>
      </div>
    </CustomModalWindow>
  )
}
