import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import styles from './RecentButtons.module.scss'

interface RecentButtonsProps {
  isCanCreate: boolean
  firstButtonClick: () => void
  secondButtonClick: () => void
}

export const RecentButtons = ({
  isCanCreate,
  firstButtonClick,
  secondButtonClick,
}: RecentButtonsProps) => {
  return (
    <div className={styles.wrapper}>
      {isCanCreate && (
        <ButtonBlue
          titleNone
          title='New Group'
          icon='/icons/plus.svg'
          style={styles.buttonPlus}
          iconProps={styles.iconPlus}
          onClick={firstButtonClick}
        />
      )}
      <ButtonBrand
        titleNone
        title='Reorder'
        icon='/icons/reorder.svg'
        style={styles.buttonWrench}
        iconProps={styles.iconWrench}
        onClick={secondButtonClick}
      />
    </div>
  )
}
