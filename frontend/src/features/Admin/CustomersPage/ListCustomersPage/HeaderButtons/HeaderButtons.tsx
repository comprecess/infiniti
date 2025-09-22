import styles from './HeaderButtons.module.scss'
import { RolesAccess } from '../../../../../app/constants/constants'
import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'

interface HeaderButtonsProps {
  access: RolesAccess | undefined
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
          title='Add Customer'
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
