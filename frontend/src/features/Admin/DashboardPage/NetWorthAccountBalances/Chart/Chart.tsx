import { useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import styles from './Chart.module.scss'
import { AdminInfo, profileInfoString } from '../../../../../app/constants/constants'
import { EditPencilFill } from '../../../../../shared/icons/EditPencilFill'
import { useCustomToast } from '../../../../../shared/ui/CustomToast/CustomToast'
import { patchChangeNetWorth } from '../../../../../shared/utils/api/Admin/Dashboard/patch-change-net-worth'
import { getSession } from '../../../../../shared/utils/Saving/Session/GetSession'

interface ChartProps {
  netWorth: number
  netWorthCurrency: string
  limit: number
  limitCurrency: string
}

export const Chart = ({ netWorth, netWorthCurrency, limit, limitCurrency }: ChartProps) => {
  const [profileData, setProfileData] = useState<AdminInfo | null>(null)

  const [editedAmount, setEditedAmount] = useState<string>(limit.toString())
  const [isEditing, setIsEditing] = useState(false)

  const showToast = useCustomToast()
  const queryClient = useQueryClient()

  const amountInputRef = useRef<HTMLInputElement>(null)

  const percentage = netWorth > limit ? (limit / limit) * 100 : (netWorth / limit) * 100

  const fetchProfileData = useCallback(async () => {
    const profileData = getSession(profileInfoString) as AdminInfo

    setProfileData(profileData as AdminInfo)
  }, [])

  const changeNetWorth = async (value: number) => {
    const { status, message } = await patchChangeNetWorth(value)

    if (status) {
      showToast({
        title: 'Successfully',
        description: 'You have successfully changed Net Worth',
        status: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['dashboard-full-info'] })
    } else {
      showToast({
        title: 'Error',
        description: message,
        status: 'error',
      })
    }
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (value === '') {
      setEditedAmount('0')

      return
    }

    value = value.replace(/^0+/, '')

    setEditedAmount(value || '0')
  }

  const handleAmountBlur = async () => {
    setIsEditing(false)

    const numberValue = Number(editedAmount) || 0

    if (numberValue !== limit) {
      setEditedAmount(String(numberValue))

      await changeNetWorth(numberValue)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      amountInputRef.current?.blur()
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        <span className={styles.amount}>{netWorthCurrency}</span>
        <span className={styles.syllable}>of</span>
        {profileData && profileData.roleId === 0 ? (
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
                  width: `${editedAmount?.toString().length || 1}ch`,
                }}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <span className={styles.total} onClick={() => setIsEditing(true)}>
                {limitCurrency}
              </span>
            )}
            <EditPencilFill style={styles.editIcon} />
          </div>
        ) : (
          <span className={styles.total}>{editedAmount}</span>
        )}
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
