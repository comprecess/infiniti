import { FC } from 'react'

import { RolesAccess } from '../../../../app/constants/constants'
import { ButtonBlue } from '../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../shared/ui/ButtonBrand/ButtonBrand'
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
          title='Add Supplier'
          icon='/icons/plus.svg'
          style={styles.buttonPlus}
          iconProps={styles.iconPlus}
          onClick={firstButtonClick}
        />
      )}
      <ButtonBrand
        titleNone
        title='Import'
        icon='/icons/import.svg'
        style={styles.buttonImport}
        iconProps={styles.iconImport}
        onClick={secondButtonClick}
      />
    </div>
  )
}
