import styleItem from '../RecentProductService.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  code: number
  name: string
  price: string
  addEditServiceBlank?: (idService: string) => void
  addNewServiceBlank?: (
    idService: string,
    price: number,
    description: string,
  ) => void
  onCloseModalWindow: () => void
}

export const Item = ({
  code,
  name,
  price,
  addEditServiceBlank,
  addNewServiceBlank,
  onCloseModalWindow,
}: ItemProps) => {
  const handleCheckFunction = () => {
    if (addEditServiceBlank) {
      addEditServiceBlank(code.toString())
    } else if (addNewServiceBlank) {
      addNewServiceBlank(code.toString(), parseInt(price), name)
    }
    onCloseModalWindow()
  }

  return (
    <div className={styles.wrapper} onClick={handleCheckFunction}>
      <span className={`${styleItem.itemCodeColumn} ${styles.codeItem}`}>
        {code}
      </span>
      <span className={`${styleItem.itemNameColumn} ${styles.nameItem}`}>
        {name}
      </span>
      <span className={`${styleItem.priceColumn} ${styles.priceItem}`}>
        {price}
      </span>
    </div>
  )
}
