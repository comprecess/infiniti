import { FC } from 'react'

import { CheckIcon } from '../../../../../../../../shared/icons/CheckIcon'
import { CreditCardIcon } from '../../../../../../../../shared/icons/CreditCardIcon'
import { EnvelopeIcon } from '../../../../../../../../shared/icons/EnvelopeIcon'
import { LifebuoyIcon } from '../../../../../../../../shared/icons/LifebuoyIcon'
import { LocationArrowIcon } from '../../../../../../../../shared/icons/LocationArrowIcon'
import { PaperPlaneIcon } from '../../../../../../../../shared/icons/PaperPlaneIcon'
import { PDFIcon } from '../../../../../../../../shared/icons/PDFIcon'
import { PhoneIcon } from '../../../../../../../../shared/icons/PhoneIcon'
import { ReplyIcon } from '../../../../../../../../shared/icons/ReplyIcon'
import { TaskIcon } from '../../../../../../../../shared/icons/TaskIcon'
import { TruckIcon } from '../../../../../../../../shared/icons/TruckIcon'
import styles from './IconItem.module.scss'

interface IconItemProps {
  nameIcon: string
}

export const IconItem: FC<IconItemProps> = ({ nameIcon }) => {
  let icon = null

  switch (nameIcon) {
    case 'check':
      icon = <CheckIcon style={styles.iconStrokeColor} />
      break
    case 'envelope':
      icon = <EnvelopeIcon style={styles.iconStrokeColor} />
      break
    case 'phone':
      icon = <PhoneIcon style={styles.iconStrokeColor} />
      break
    case 'paperPlane':
      icon = <PaperPlaneIcon style={styles.iconStrokeColor} />
      break
    case 'pdf':
      icon = <PDFIcon style={styles.iconStrokeColor} />
      break
    case 'lifeRing':
      icon = <LifebuoyIcon style={styles.iconFillColor} />
      break
    case 'creditCard':
      icon = <CreditCardIcon style={styles.iconStrokeColor} />
      break
    case 'locationArrow':
      icon = <LocationArrowIcon style={styles.iconStrokeColor} />
      break
    case 'reply':
      icon = <ReplyIcon style={styles.iconStrokeColor} />
      break
    case 'task':
      icon = <TaskIcon style={styles.iconStrokeColor} />
      break
    case 'truck':
      icon = <TruckIcon style={styles.iconStrokeColor} />
      break
  }

  return <div className={styles.icon}>{icon}</div>
}
