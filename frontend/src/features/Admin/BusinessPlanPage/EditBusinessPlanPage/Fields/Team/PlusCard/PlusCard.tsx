import { PlusIcon } from '../../../../../../../shared/icons/PlusIcon'
import { Icon } from '../../../../../../../shared/ui/Icon/Icon'
import styles from './PlusCard.module.scss'

export const PlusCard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.circle}>
        <Icon
          hover={false}
          icon={<PlusIcon style={styles.icon} />}
          style={styles.wrapperIcon}
        />
      </div>
    </div>
  )
}
