import { FC } from 'react'

import { IconsListData } from '../../../../../../../app/data/textEditorIcons'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { TextEditor } from '../../../../../../../shared/ui/TextEditor/TextEditor'
import { Item } from './Item/Item'
import styles from './TextEditorWrapper.module.scss'

interface TextEditorWrapperProps {
  selectedIcon: string
  setSelectedIcon: (nameIcon: string) => void
  setMessage: (message: string) => void
  addNewActivity: () => void
}

export const TextEditorWrapper: FC<TextEditorWrapperProps> = ({
  selectedIcon,
  setSelectedIcon,
  setMessage,
  addNewActivity,
}) => {
  const changeIcon = (nameIcon: string) => {
    setSelectedIcon(nameIcon)
  }

  return (
    <div className={styles.wrapper}>
      <TextEditor placeholder='Add Activity...' setValue={setMessage} />
      <div className={styles.iconsListAndPost}>
        <div className={styles.iconsList}>
          {IconsListData.map(item => {
            return (
              <Item
                key={item.id}
                iconComponent={item.icon}
                nameIcon={item.nameIcon}
                isActive={selectedIcon === item.nameIcon}
                isStroke={item.stroke}
                onClick={changeIcon}
              />
            )
          })}
        </div>
        <div className={styles.post}>
          <ButtonBlue
            title='Add Activity'
            icon='/icons/plus.svg'
            style={styles.buttonBlue}
            onClick={addNewActivity}
          />
        </div>
      </div>
    </div>
  )
}
