import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

import styles from './Item.module.scss'
import { NameIdType } from '../../../../app/constants/constants'
import { CrossIcon } from '../../../../shared/icons/CrossIcon'
import { EditPencilFill } from '../../../../shared/icons/EditPencilFill'
import { CustomSelect } from '../../../../shared/ui/CustomSelect/CustomSelect'
import styleItem from '../../../../widgets/BasketCart/Cart/Cart.module.scss'

interface ItemProps {
  id: number
  amount: number
  avatar: string
  nameEmail: string
  profession: string
  nameIdType: NameIdType
  taxes: number
  taxesAmount: string
  total: string
  onDelete: () => void
  onChangeItem: (idItem: number, data: { [key: string]: number | string }) => void
}

export const Item = ({
  id,
  amount,
  avatar,
  nameEmail,
  profession,
  nameIdType,
  taxes,
  taxesAmount,
  total,
  onDelete,
  onChangeItem,
}: ItemProps) => {
  const [editedAmount, setEditedAmount] = useState<number | ''>(amount)

  const amountInputRef = useRef<HTMLInputElement>(null)

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditedAmount(value === '' ? '' : Number(value))
  }

  const handleAmountBlur = async () => {
    if (editedAmount !== amount) {
      if (editedAmount === '') {
        onChangeItem(id, { amount: 0 })
        setEditedAmount(0)
      } else {
        onChangeItem(id, { amount: editedAmount })
      }
    }
  }

  const handleTypeBlur = async (value: number) => {
    onChangeItem(id, {
      type: ['priceHour', 'priceDay'][value],
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      amountInputRef.current?.blur()
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.avatarColumn}>
        <div className={styles.avatar}>
          <img
            alt='Avatar'
            src={avatar ? `${avatar}?width=128&height=128` : '/profileWithoutAvatar.svg'}
          />
        </div>
      </div>
      <div className={`${styleItem.nameEmailColumn} ${styles.itemsColumn}`}>
        <span className={styles.nameEmailItem}>{nameEmail}</span>
        <span className={styles.professionItem}>{profession}</span>
      </div>
      <div className={`${styleItem.quantityColumn} ${styles.containerColumn}`}>
        <input
          ref={amountInputRef}
          type='number'
          name='number'
          value={editedAmount !== '' ? editedAmount : ''}
          className={styles.amountInput}
          onChange={handleAmountChange}
          onBlur={handleAmountBlur}
          onKeyDown={e => handleKeyDown(e)}
        />
        <EditPencilFill style={styles.editIcon} />
      </div>
      <div className={styleItem.typeColumn}>
        <CustomSelect
          idList={[0, 1]}
          height='40px'
          nameList={['Hour', 'Day']}
          value={['priceHour', 'priceDay'].findIndex(item => item === nameIdType)}
          onInputChange={false}
          onChange={(_name, value) => handleTypeBlur(value)}
        />
      </div>
      <div className={`${styleItem.taxesColumn} ${styles.itemsRow}`}>
        {taxes === 1 ? (
          <span className={styles.taxesItem}>No TAX</span>
        ) : (
          <>
            <img src='/icons/info.svg' alt='Info' />
            <span className={styles.taxesItem}>Included</span>
          </>
        )}
      </div>
      <div className={`${styleItem.amountColumn} ${styles.itemsColumn}`}>
        <span className={styles.amountItem}>{total}</span>
        <span className={styles.taxesAmountItem}>{taxesAmount}</span>
      </div>
      <div className={styleItem.crossColumn}>
        <div className={styles.crossItem} onClick={onDelete}>
          <CrossIcon />
        </div>
      </div>
    </div>
  )
}
