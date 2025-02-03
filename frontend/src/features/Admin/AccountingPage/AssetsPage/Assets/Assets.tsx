import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import styles from './Assets.module.scss'

export const Assets = () => {
  return (
    <div className={styles.wrapper}>
      <ButtonBlue title='Add an Asset' />
      <div className={styles.categoriesList}>list</div>
      <ButtonBlue title='New Category' />
    </div>
  )
}
