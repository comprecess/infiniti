import { FC, useEffect, useState } from 'react'

import { ArrowItem } from './ArrowItem/ArrowItem'
import { NumberItem } from './NumberItem/NumberItem'
import styles from './PagesList.module.scss'

interface PagesListProps {
  currentPage: number
  totalPages: number
  leftButtonDisabled: boolean
  leftButtonOnClick: () => void
  rightButtonDisabled: boolean
  rightButtonOnClick: () => void
  onPageChange: (pageNumber: number) => void
}

export const PagesList: FC<PagesListProps> = ({
  currentPage,
  totalPages,
  leftButtonDisabled,
  leftButtonOnClick,
  rightButtonDisabled,
  rightButtonOnClick,
  onPageChange,
}) => {
  const [maxVisiblePages, setMaxVisiblePages] = useState<number>(4)

  useEffect(() => {
    const handleResize = () => {
      const isDesktopView =
        window.innerWidth <= 1920 && window.innerWidth > 1200
      const isTabletView =
        window.innerWidth <= 1200 && window.innerWidth > 600
      const isMobileView = window.innerWidth <= 600

      if (isDesktopView) {
        setMaxVisiblePages(4)
      } else if (isTabletView) {
        setMaxVisiblePages(4)
      } else if (isMobileView) {
        setMaxVisiblePages(2)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber)
  }

  const renderPages = () => {
    const pages = []

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2),
    )
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = totalPages - maxVisiblePages + 1
      endPage = totalPages
    }

    if (totalPages < 4) {
      startPage = 1
      endPage = totalPages
    } else {
      if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = totalPages - maxVisiblePages + 1
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <NumberItem
          key={i}
          number={i}
          isActive={i === currentPage}
          onClick={() => handlePageClick(i)}
        />,
      )
    }

    if (totalPages > 4) {
      const middleIndex = Math.floor(pages.length / 2)

      pages.splice(
        middleIndex,
        0,
        <div key='divider' className={styles.divider}>
          ...
        </div>,
      )
    }

    return pages
  }

  return (
    <div className={styles.wrapper}>
      <ArrowItem
        disabled={leftButtonDisabled}
        onClick={leftButtonOnClick}
      />
      {renderPages()}
      <ArrowItem
        isLeftArrow={false}
        disabled={rightButtonDisabled}
        onClick={rightButtonOnClick}
      />
    </div>
  )
}
