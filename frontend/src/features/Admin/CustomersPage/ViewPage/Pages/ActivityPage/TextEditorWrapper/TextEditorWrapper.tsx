import { FC } from 'react'

import { CheckIcon } from '../../../../../../../shared/icons/CheckIcon'
import { CreditCardIcon } from '../../../../../../../shared/icons/CreditCardIcon'
import { EnvelopeIcon } from '../../../../../../../shared/icons/EnvelopeIcon'
import { LifebuoyIcon } from '../../../../../../../shared/icons/LifebuoyIcon'
import { LocationArrowIcon } from '../../../../../../../shared/icons/LocationArrowIcon'
import { PaperPlaneIcon } from '../../../../../../../shared/icons/PaperPlaneIcon'
import { PDFIcon } from '../../../../../../../shared/icons/PDFIcon'
import { PhoneIcon } from '../../../../../../../shared/icons/PhoneIcon'
import { ReplyIcon } from '../../../../../../../shared/icons/ReplyIcon'
import { TaskIcon } from '../../../../../../../shared/icons/TaskIcon'
import { TruckIcon } from '../../../../../../../shared/icons/TruckIcon'
import { ButtonBlue } from '../../../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { TextEditor } from '../../../../../../../shared/ui/TextEditor/TextEditor'
import { Item } from './Item/Item'
import styles from './TextEditorWrapper.module.scss'

const iconsList = [
  {
    id: 0,
    nameIcon: 'check',
    icon: <CheckIcon />,
    stroke: true,
  },
  {
    id: 1,
    nameIcon: 'envelope',
    icon: <EnvelopeIcon />,
    stroke: true,
  },
  {
    id: 2,
    nameIcon: 'phone',
    icon: <PhoneIcon />,
    stroke: true,
  },
  {
    id: 3,
    nameIcon: 'paperPlane',
    icon: <PaperPlaneIcon />,
    stroke: true,
  },
  {
    id: 4,
    nameIcon: 'pdf',
    icon: <PDFIcon />,
    stroke: true,
  },
  {
    id: 5,
    nameIcon: 'lifeRing',
    icon: <LifebuoyIcon />,
    stroke: false,
  },
  {
    id: 6,
    nameIcon: 'creditCard',
    icon: <CreditCardIcon />,
    stroke: true,
  },
  {
    id: 7,
    nameIcon: 'locationArrow',
    icon: <LocationArrowIcon />,
    stroke: true,
  },
  {
    id: 8,
    nameIcon: 'reply',
    icon: <ReplyIcon />,
    stroke: true,
  },
  {
    id: 9,
    nameIcon: 'task',
    icon: <TaskIcon />,
    stroke: true,
  },
  {
    id: 10,
    nameIcon: 'truck',
    icon: <TruckIcon />,
    stroke: true,
  },
]

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
          {iconsList.map(item => {
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
