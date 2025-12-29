import { Item } from './Item/Item'
import styles from './TextEditorWrapper.module.scss'
import { IconsListData } from '../../../../../../../app/data/textEditorIcons'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { TextEditor } from '../../../../../../../shared/ui/TextEditor/TextEditor'

interface TextEditorWrapperProps {
  selectedIcon: string
  message: string
  setSelectedIcon: (nameIcon: string) => void
  setMessage: (message: string) => void
  addNewActivity: () => void
}

export const TextEditorWrapper = ({
  selectedIcon,
  message,
  setSelectedIcon,
  setMessage,
  addNewActivity,
}: TextEditorWrapperProps) => {
  const addActivity = () => {
    addNewActivity()
    setMessage('')
  }

  const changeIcon = (nameIcon: string) => {
    setSelectedIcon(nameIcon)
  }

  return (
    <div className={styles.wrapper}>
      <TextEditor placeholder='Add Activity...' defaultValue={message} setValue={setMessage} />
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
          <ButtonBlue title='Add Activity' icon='/icons/plus.svg' onClick={addActivity} />
        </div>
      </div>
    </div>
  )
}
