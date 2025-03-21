import { ReactNode, useEffect, useState } from 'react'

import { TypeViewCompany } from '../../../../../../app/constants/constants'
import styles from './SideBarItem.module.scss'

interface SideBarItemProps {
  name: string
  icon: ReactNode
  isFirst: boolean
  isLast: boolean
  isActive: boolean
  type: string
  allTypes: TypeViewCompany
  onClick: () => void
}

export const SideBarItem = ({
  name,
  icon,
  isFirst,
  isLast,
  isActive,
  type,
  allTypes,
  onClick,
}: SideBarItemProps) => {
  const [numberItems, setNumberItems] = useState<number | null>(null)

  const wrapperClass = isActive
    ? styles.wrapperActive
    : styles.wrapperDisable

  const getNumberBadge = () => {
    for (const key in allTypes) {
      if (key === type) {
        setNumberItems(allTypes[key])
        break
      }
    }
  }

  useEffect(() => {
    getNumberBadge()
  }, [])

  return (
    <div
      className={`${wrapperClass} ${isFirst ? styles.first : ''} ${
        isLast ? styles.last : ''
      }`}
      onClick={!isActive ? onClick : () => {}}
    >
      <div className={styles.container}>
        <div className={isActive ? styles.iconActive : styles.iconDisable}>
          {icon}
        </div>
        <span
          className={
            isActive ? styles.nameCompanyActive : styles.nameCompanyDisable
          }
        >
          {name}
        </span>
      </div>
      {numberItems !== null && (
        <div className={styles.badge}>
          <span className={styles.count}>{numberItems}</span>
        </div>
      )}
    </div>
  )
}
