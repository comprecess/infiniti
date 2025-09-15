import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

import { EditPencilFill } from '../../../../../shared/icons/EditPencilFill'
import styles from './Chart.module.scss'

interface ChartProps {
  amount: string
  total: string
}

export const Chart = ({ amount, total }: ChartProps) => {
  const [editedAmount, setEditedAmount] = useState<number | ''>(
    parseInt(total),
  )
  const [isEditing, setIsEditing] = useState(false)

  const amountInputRef = useRef<HTMLInputElement>(null)

  const amountValue = parseFloat(amount.replace(/[$,]/g, ''))
  const totalValue = parseFloat(total.replace(/[$,]/g, ''))

  const percentage =
    amountValue > totalValue
      ? (totalValue / totalValue) * 100
      : (amountValue / totalValue) * 100

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditedAmount(value === '' ? '' : Number(value))
  }

  const handleAmountBlur = async () => {
    setIsEditing(false)

    if (editedAmount === '') {
      setEditedAmount(0)
    }

    // тут можно вызвать onSubmit или другой обработчик
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      amountInputRef.current?.blur()
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        <span className={styles.amount}>{amount}</span>
        <span className={styles.syllable}>of</span>
        <div
          className={styles.inputWrapper}
          onClick={() => {
            setIsEditing(true)
            setTimeout(() => amountInputRef.current?.focus(), 0)
          }}
        >
          {isEditing ? (
            <input
              ref={amountInputRef}
              autoFocus
              type='number'
              name='number'
              value={editedAmount !== '' ? editedAmount : ''}
              className={styles.amountInput}
              style={{
                width: `${(editedAmount?.toString().length || 1) + 1}ch`,
              }}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span
              className={styles.total}
              onClick={() => setIsEditing(true)}
            >
              {editedAmount}
            </span>
          )}
          <EditPencilFill style={styles.editIcon} />
        </div>
      </div>
      <div className={styles.segments}>
        <div className={styles.backgroundSegment}>
          <div
            className={styles.segment}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
