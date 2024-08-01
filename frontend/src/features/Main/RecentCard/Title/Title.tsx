import { FC, useCallback, useEffect, useState } from 'react'

import styles from './Title.module.scss'

interface TitleProps {
  title: string
  style?: string
  sorted?: boolean
  sortType?: number
  sortName?: string
  sortIndex?: number
  changeSortName?: (
    index: number,
    sortNameItem: string,
    sortTypeItem: number,
  ) => void
  clearSort?: () => void
}

export const Title: FC<TitleProps> = ({
  title,
  style,
  sorted = false,
  sortType,
  sortName,
  sortIndex,
  changeSortName,
  clearSort,
}) => {
  const [currentSortType, setCurrentSortType] = useState<number | null>(
    sortType || null,
  )

  const handleClick = useCallback(() => {
    if (changeSortName && clearSort && sortName) {
      clearSort()

      const newSortType = currentSortType === 1 ? 0 : 1

      setCurrentSortType(newSortType)
      changeSortName(sortIndex || 0, sortName, newSortType)
    }
  }, [currentSortType, sortName, changeSortName])

  useEffect(() => {
    setCurrentSortType(sortType ?? null)
  }, [sortType])

  return (
    <div
      className={
        sorted
          ? `${styles.wrapperPointer} ${style}`
          : `${styles.wrapper} ${style}`
      }
      onClick={handleClick}
    >
      <span className={styles.title}>{title}</span>
      {sorted && (
        <img
          src={'/icons/sort.svg'}
          alt='SortIcon'
          className={
            currentSortType === 1
              ? styles.descendingIcon
              : styles.ascendingIcon
          }
        />
      )}
    </div>
  )
}
