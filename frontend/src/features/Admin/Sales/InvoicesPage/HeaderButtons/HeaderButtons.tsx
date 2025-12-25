import styles from './HeaderButtons.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'

interface HeaderButtonsProps {
  access: RolesAccess
  firstButtonClick: () => void
  secondButtonClick: () => void
}

export const HeaderButtons = ({
  access,
  firstButtonClick,
  secondButtonClick,
}: HeaderButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      {access && access.create === 1 && (
        <ButtonBlue
          titleNone
          title='Add Invoice'
          icon='/icons/plus.svg'
          iconProps={styles.iconPlus}
          onClick={firstButtonClick}
        />
      )}
      <ButtonBrand
        titleNone
        title='View Reports'
        icon='/icons/view.svg'
        iconProps={styles.iconView}
        onClick={secondButtonClick}
      />
    </div>
  )
}
