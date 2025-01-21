import { FC } from 'react'

import { RolesAccess } from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import styles from './HeaderButtons.module.scss'

interface HeaderButtonsProps {
  access: RolesAccess
  firstButtonClick: () => void
  secondButtonClick: () => void
}

export const HeaderButtons: FC<HeaderButtonsProps> = ({
  access,
  firstButtonClick,
  secondButtonClick,
}) => {
  return (
    <div className={styles.wrapper}>
      {access && access.create && (
        <ButtonBlue
          titleNone
          title='Add Invoice'
          icon='/icons/plus.svg'
          style={styles.buttonPlus}
          iconProps={styles.iconPlus}
          onClick={firstButtonClick}
        />
      )}
      <ButtonBrand
        titleNone
        title='View Reports'
        icon='/icons/view.svg'
        style={styles.buttonView}
        iconProps={styles.iconView}
        onClick={secondButtonClick}
      />
    </div>
  )
}
