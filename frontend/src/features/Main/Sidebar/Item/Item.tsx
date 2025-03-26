import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Item.module.scss'

interface ItemProps {
  title?: string
  icon?: ReactNode
  isIcon?: boolean
  isActive: boolean
  path: string
  isMini?: boolean
  onItemClick: (pageName: string) => void
}

export const Item = ({
  title,
  icon,
  isIcon = true,
  isActive,
  path,
  isMini,
  onItemClick,
}: ItemProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={isActive ? styles.wrapperActive : styles.wrapperNotActive}
      onClick={() => onItemClick(path)}
    >
      <div className={isMini ? styles.itemsIsMini : styles.items}>
        <div className={styles.leftItems}>
          {isIcon && <div className={styles.icon}>{icon}</div>}
          {isMini || <span className={styles.title}>{t(`${title}`)}</span>}
        </div>
      </div>
    </div>
  )
}
