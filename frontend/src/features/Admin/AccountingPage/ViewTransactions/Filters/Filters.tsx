import { ButtonBlue } from '../../../../../shared/ui/ButtonBlue/ButtonBlue'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import styles from './Filters.module.scss'

export const Filters = () => {
  return (
    <div className={styles.wrapper}>
      <div>-Date Range-</div>
      <CustomSelect
        title='Transaction Type'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Account'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Contact'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <CustomSelect
        title='Category'
        idList={[]}
        nameList={[]}
        onChange={() => {}}
      />
      <ButtonBlue title='Filter' style={styles.buttonSubmit} />
    </div>
  )
}
