import './OpenItem.scss'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './OpenItem.module.scss'
import { ChevronDownIcon } from '../../../../shared/icons/ChevronDownIcon'
import { Item } from '../Item/Item'

export interface openPathsProps {
  id: number
  title: string
  path: string
  create: boolean
  shortName?: string
}

interface OpenItemProps {
  title?: string
  icon: ReactNode
  openPath: openPathsProps[]
  isActive: boolean
  path: string
  isMini?: boolean
  isOpened: boolean
  onItemClick: (pageName: string) => void
  onToggleOpen: (path: string) => void
}

export const OpenItem = ({
  title,
  icon,
  openPath,
  isActive,
  path,
  isMini,
  isOpened,
  onItemClick,
  onToggleOpen,
}: OpenItemProps) => {
  const { t } = useTranslation()

  return (
    <Popover
      closeOnBlur
      placement='right'
      isOpen={isMini && isOpened}
      returnFocusOnClose={false}
      onClose={() => onToggleOpen(path)}
    >
      <PopoverTrigger>
        <div className={styles.wrapper}>
          <div
            className={
              isActive ? styles.wrapperActive : styles.wrapperNotActive
            }
            onClick={() => onToggleOpen(path)}
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
                    isOpened
                      ? styles.isOpenedPathsList
                      : styles.chevronIcon
                  }
                />
              )}
            </div>
          </div>
          {!isOpened ||
            isMini ||
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
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          className={styles.popoverContent}
          padding={4}
          _focus={{
            outline: 'none',
            boxShadow: '1px 1px 8px #acb2f3',
            border: 'none',
          }}
          _active={{
            outline: 'none',
            boxShadow: '1px 1px 8px #acb2f3',
            border: 'none',
          }}
        >
          {openPath.map(item => {
            return (
              <Item
                key={item.id}
                title={item.title}
                isActive={false}
                isIcon={false}
                path={''}
                onItemClick={() => onItemClick(path + '/' + item.path)}
              />
            )
          })}
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
