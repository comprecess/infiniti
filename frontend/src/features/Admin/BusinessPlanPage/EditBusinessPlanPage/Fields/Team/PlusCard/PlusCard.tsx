import styles from './PlusCard.module.scss'
import { PlusIcon } from '../../../../../../../shared/icons/PlusIcon'
import { Icon } from '../../../../../../../shared/ui/Icon/Icon'

interface PlusCardProps {
  onClick: () => void
}

export const PlusCard = ({ onClick }: PlusCardProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.circle} onClick={onClick}>
        <Icon
          hover={false}
          icon={<PlusIcon style={styles.icon} />}
          style={styles.wrapperIcon}
        />
      </div>
    </div>
  )
}
