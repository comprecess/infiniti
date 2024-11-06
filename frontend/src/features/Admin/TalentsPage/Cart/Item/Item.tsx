import { FC, useEffect, useRef, useState } from 'react'

import { NameIdType } from '../../../../../app/constants/constants'
import { CrossIcon } from '../../../../../shared/icons/CrossIcon'
import { CustomSelect } from '../../../../../shared/ui/CustomSelect/CustomSelect'
import styleItem from '../Cart.module.scss'
import styles from './Item.module.scss'

interface ItemProps {
  idCart: number
  idItem: number
  amount: number
  avatar: string
  nameEmail: string
  profession: string
  nameIdType: NameIdType
  taxes: number
  taxesAmount: string
  total: string
  onDelete: () => void
  onChangeItem: (
    idCart: number,
    idItem: number,
    data: { [key: string]: number | string },
  ) => void
}

export const Item: FC<ItemProps> = ({
  idCart,
  idItem,
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
}) => {
  const [editingField, setEditingField] = useState<'amount' | null>(null)

  const [editedAmount, setEditedAmount] = useState(amount)

  const amountInputRef = useRef<HTMLInputElement>(null)

  const handleAmountClick = () => {
    if (editingField === null) {
      setEditingField('amount')
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedAmount(Number(e.target.value))
  }

  const handleAmountBlur = async () => {
    setEditingField(null)
    if (editedAmount !== amount) {
      onChangeItem(idCart, idItem, { amount: editedAmount })
    }
  }

  const handleTypeBlur = async (value: number) => {
    onChangeItem(idCart, idItem, {
      type: ['priceHour', 'priceDay'][value],
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAmountBlur()
    } else if (e.key === 'Escape') {
      setEditedAmount(amount)
      setEditingField(null)
    }
  }

  useEffect(() => {
    if (editingField === 'amount' && amountInputRef.current) {
      amountInputRef.current.focus()
    }
  }, [editingField])

  return (
    <div className={styles.wrapper}>
      <div className={styleItem.avatarColumn}>
        <img
          src={avatar ? avatar : '/profileWithoutAvatar.svg'}
          alt='Avatar'
          className={styles.avatar}
        />
      </div>
      <div
        className={`${styleItem.nameEmailColumn} ${styles.itemsColumn}`}
      >
        <span className={styles.nameEmailItem}>{nameEmail}</span>
        <span className={styles.professionItem}>{profession}</span>
      </div>
      <div className={`${styleItem.quantityColumn} ${styles.itemsColumn}`}>
        {editingField === 'amount' ? (
          <input
            ref={amountInputRef}
            type='number'
            value={editedAmount}
            className={styles.amountInput}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            onKeyDown={e => handleKeyDown(e)}
          />
        ) : (
          <span
            className={styles.quantityItem}
            onClick={handleAmountClick}
          >
            {editedAmount}
          </span>
        )}
      </div>
      <div className={styleItem.typeColumn}>
        <CustomSelect
          idList={[0, 1]}
          nameList={['Hour', 'Day']}
          value={['priceHour', 'priceDay'].findIndex(
            item => item === nameIdType,
          )}
          onInputChange={false}
          onChange={(_name, value) => handleTypeBlur(value)}
        />
      </div>
      <div className={`${styleItem.taxesColumn} ${styles.itemsRow}`}>
        {taxes === 1 ? (
          <span className={styles.taxesItem}>Not included</span>
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
