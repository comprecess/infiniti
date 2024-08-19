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
import styles from './TextEditorWrapper.module.scss'

const iconsList = [
  { id: 0, icon: CheckIcon, style: styles.iconStroke },
  { id: 1, icon: EnvelopeIcon, style: styles.iconStroke },
  { id: 2, icon: PhoneIcon, style: styles.iconStroke },
  { id: 3, icon: PaperPlaneIcon, style: styles.iconStroke },
  { id: 4, icon: PDFIcon, style: styles.iconStroke },
  { id: 5, icon: LifebuoyIcon, style: styles.iconFill },
  { id: 6, icon: CreditCardIcon, style: styles.iconStroke },
  { id: 7, icon: LocationArrowIcon, style: styles.iconStroke },
  { id: 8, icon: ReplyIcon, style: styles.iconStroke },
  { id: 9, icon: TaskIcon, style: styles.iconStroke },
  { id: 10, icon: TruckIcon, style: styles.iconStroke },
]

export const TextEditorWrapper: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TextEditor placeholder='Add Activity...' />
      <div className={styles.iconsListAndPost}>
        <div className={styles.iconsList}>
          {iconsList.map(item => {
            const IconComponent = item.icon

            return (
              <div key={item.id} className={styles.iconButton}>
                <IconComponent style={item.style} />
              </div>
            )
          })}
        </div>
        <div className={styles.post}>
          <ButtonBlue
            title='Add Activity'
            icon='/icons/plus.svg'
            style={styles.buttonBlue}
          />
        </div>
      </div>
    </div>
  )
}
