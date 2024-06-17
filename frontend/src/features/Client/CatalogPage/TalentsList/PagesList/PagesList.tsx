import { FC, useCallback, useEffect, useMemo } from 'react'

import { TalentsListMetaData } from '../../../../../app/constants/constants'
import { ArrowItem } from './ArrowItem/ArrowItem'
import { NumberItem } from './NumberItem/NumberItem'
import styles from './PagesList.module.scss'

interface PagesListProps {
  meta: TalentsListMetaData
  nextPage: (id: number) => void
}

export const PagesList: FC<PagesListProps> = ({ meta, nextPage }) => {
  // const [maxVisiblePages, setMaxVisiblePages] = useState<number>(4)

  useEffect(() => {
    const handleResize = () => {
      const isDesktopView =
        window.innerWidth <= 1920 && window.innerWidth > 1200
      const isTabletView =
        window.innerWidth <= 1200 && window.innerWidth > 600
      const isMobileView = window.innerWidth <= 600

      if (isDesktopView || isTabletView) {
        // setMaxVisiblePages(4)
      } else if (isMobileView) {
        // setMaxVisiblePages(2)
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

    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(
        <NumberItem
          key={i}
          number={i}
          isActive={meta.links[i].active}
          onClick={() => nextPage(i)}
        />,
      )
    }

    if (meta.last_page > 4) {
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
  }, [meta])

  return (
    <div className={styles.wrapper}>
      <ArrowItem onClick={lastArrowPage} />
      {renderPages}
      <ArrowItem isLeftArrow={false} onClick={nextArrowPage} />
    </div>
  )
}
