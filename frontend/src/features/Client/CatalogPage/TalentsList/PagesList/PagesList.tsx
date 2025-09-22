import { useCallback, useEffect, useMemo, useState } from 'react'

import { ArrowItem } from './ArrowItem/ArrowItem'
import { BackGround } from './BackGround/BackGround'
import { NumberItem } from './NumberItem/NumberItem'
import styles from './PagesList.module.scss'
import { PagesMetaData } from '../../../../../app/constants/constants'

interface PagesListProps {
  meta: PagesMetaData
  nextPage: (page: number) => void
  size?: 'sm' | 'md'
}

export const PagesList = ({ meta, size, nextPage }: PagesListProps) => {
  const [maxVisiblePages, setMaxVisiblePages] = useState<number>(4)

  useEffect(() => {
    const handleResize = () => {
      const isDesktopView =
        window.innerWidth <= 1920 && window.innerWidth > 1200
      const isTabletView =
        window.innerWidth <= 1200 && window.innerWidth > 600
      const isMobileView = window.innerWidth <= 600

      if (isDesktopView || isTabletView) {
        setMaxVisiblePages(4)
      } else if (isMobileView) {
        setMaxVisiblePages(2)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextArrowPage = useCallback(() => {
    if (meta.current_page < meta.last_page) {
      nextPage(meta.current_page + 1)
    }
  }, [meta])

  const lastArrowPage = useCallback(() => {
    if (meta.current_page > 1) {
      nextPage(meta.current_page - 1)
    }
  }, [meta])

  const renderPages = useMemo(() => {
    const pages = []

    const countPages =
      meta.last_page > 1
        ? meta.last_page - (maxVisiblePages - 1)
        : meta.last_page

    for (
      let i = Math.min(meta.current_page, countPages);
      i <= meta.last_page;
      i++
    ) {
      if (i > 0) {
        pages.push(
          <NumberItem
            key={`page-${i}`}
            number={i}
            isActive={meta.current_page === i}
            size={size}
            onClick={() => nextPage(i)}
          />,
        )
      }
    }

    if (meta.last_page > maxVisiblePages) {
      const firstPages = pages.slice(0, maxVisiblePages / 2)
      const lastPages = pages.slice(-maxVisiblePages / 2)
      const middlePages = (
        <BackGround key='middlePages' backGroundActive={false} size={size}>
          ...
        </BackGround>
      )

      return [...firstPages, middlePages, ...lastPages]
    }

    return pages
  }, [meta, maxVisiblePages, nextPage])

  return (
    <div className={styles.wrapper}>
      <ArrowItem size={size} onClick={lastArrowPage} />
      {renderPages}
      <ArrowItem size={size} isLeftArrow={false} onClick={nextArrowPage} />
    </div>
  )
}
