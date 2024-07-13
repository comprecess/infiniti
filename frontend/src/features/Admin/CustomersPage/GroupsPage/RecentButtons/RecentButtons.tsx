import { FC } from 'react'

import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { ButtonBrand } from '../../../../../shared/ui/ButtonBrand/ButtonBrand'
import styles from './RecentButtons.module.scss'

interface RecentButtonsProps {
  firstButtonClick: () => void
  secondButtonClick: () => void
}

export const RecentButtons: FC<RecentButtonsProps> = ({
  firstButtonClick,
  secondButtonClick,
}) => {
  return (
    <div className={styles.wrapper}>
      <ButtonBlue
        titleNone
        title='New Group'
        icon='/icons/plus.svg'
        style={styles.buttonPlus}
        iconProps={styles.iconPlus}
        onClick={firstButtonClick}
      />
      <ButtonBrand
        titleNone
        title='Reorder'
        icon='/icons/wrench.svg'
        style={styles.buttonWrench}
        iconProps={styles.iconWrench}
        onClick={secondButtonClick}
      />
    </div>
  )
}
