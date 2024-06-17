import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { TalentsListMetaData } from '../../../../../app/constants/constants'
import { ArrowItem } from './ArrowItem/ArrowItem'
import { NumberItem } from './NumberItem/NumberItem'
import styles from './PagesList.module.scss'

interface PagesListProps {
  meta: TalentsListMetaData
  nextPage: (id: number) => void
}

export const PagesList: FC<PagesListProps> = ({ meta, nextPage }) => {
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

    for (
      let i = Math.min(
        meta.current_page,
        meta.last_page - (maxVisiblePages - 1),
      );
      i <= meta.last_page;
      i++
    ) {
      pages.push(
        <NumberItem
          key={i}
          number={i}
          isActive={meta.links[i].active}
          onClick={() => nextPage(i)}
        />,
      )
    }

    if (meta.last_page > maxVisiblePages) {
      const firstPages = pages.slice(0, maxVisiblePages / 2)
      const lastPages = pages.slice(-maxVisiblePages / 2)
      const middlePages = (
        <div key='divider' className={styles.divider}>
          ...
        </div>
      )

      return [...firstPages, middlePages, ...lastPages]
    }

    return pages
  }, [meta, maxVisiblePages, nextPage])

  return (
    <div className={styles.wrapper}>
      <ArrowItem onClick={lastArrowPage} />
      {renderPages}
      <ArrowItem isLeftArrow={false} onClick={nextArrowPage} />
    </div>
  )
}
