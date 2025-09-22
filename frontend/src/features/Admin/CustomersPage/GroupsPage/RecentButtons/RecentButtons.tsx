import styles from './RecentButtons.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'

interface RecentButtonsProps {
  access: RolesAccess
  firstButtonClick: () => void
  secondButtonClick: () => void
}

export const RecentButtons = ({
  access,
  firstButtonClick,
  secondButtonClick,
}: RecentButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      {access.create === 1 && (
        <ButtonBlue
          titleNone
          title='New Group'
          icon='/icons/plus.svg'
          style={styles.buttonPlus}
          iconProps={styles.iconPlus}
          onClick={firstButtonClick}
        />
      )}
      {access.edit === 1 && (
        <ButtonBrand
          titleNone
          title='Reorder'
          icon='/icons/reorder.svg'
          style={styles.buttonWrench}
          iconProps={styles.iconWrench}
          onClick={secondButtonClick}
        />
      )}
    </div>
  )
}
