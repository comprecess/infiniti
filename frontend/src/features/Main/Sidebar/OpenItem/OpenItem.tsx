import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import { Item } from '../Item/Item'
import styles from './OpenItem.module.scss'

export interface openPathsProps {
  id: number
  title: string
  path: string
  create: boolean
  shortName?: string
}

interface OpenItemProps {
  title?: string
  icon: React.ReactNode
  openPath: openPathsProps[]
  isActive: boolean
  path: string
  isMini?: boolean
  onItemClick: (pageName: string) => void
}

export const OpenItem: FC<OpenItemProps> = ({
  title,
  icon,
  openPath,
  isActive,
  path,
  isMini,
  onItemClick,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const { t } = useTranslation()

  const openPathList = () => {
    if (!isMini) {
      setIsOpened(!isOpened)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={
          isActive ? styles.wrapperActive : styles.wrapperNotActive
        }
        onClick={() => openPathList()}
      >
        <div className={isMini ? styles.itemsIsMini : styles.items}>
          <div className={styles.leftItems}>
            <div className={styles.icon}>{icon}</div>
            {isMini || (
              <span className={styles.title}>{t(`${title}`)}</span>
            )}
          </div>
          {isMini || (
            <ChevronDownIcon
              style={
                isOpened ? styles.isOpenedPathsList : styles.chevronIcon
              }
            />
          )}
        </div>
      </div>
      {!isOpened ||
        openPath.map(item => {
          return (
            <Item
              key={item.id}
              title={item.title}
              isActive={false}
              path={''}
              onItemClick={() => onItemClick(path + '/' + item.path)}
            />
          )
        })}
    </div>
  )
}
