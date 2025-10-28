import { useEffect, useRef, useState } from 'react'

import styles from './Scrollable.module.scss'

interface ScrollableProps {
  children: React.ReactNode
  className?: string
  scrollAmount?: number
  showArrows?: boolean
}

export const Scrollable = ({
  children,
  className,
  scrollAmount = 300,
  showArrows = true,
}: ScrollableProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const momentumID = useRef<number | null>(null)
  const moved = useRef(false)
  const preventClickRef = useRef(false)

  const updateScroll = () => {
    const el = containerRef.current

    if (!el) return

    const canLeft = el.scrollLeft > 0
    const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    const scrollable = el.scrollWidth > el.clientWidth + 1

    setCanScrollLeft(canLeft)
    setCanScrollRight(canRight)
    setIsScrollable(scrollable)
  }

  const scroll = (dir: 'left' | 'right') => {
    const el = containerRef.current

    if (!el) return

    const amount = dir === 'left' ? -scrollAmount : scrollAmount
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el || !isScrollable) return

    if (momentumID.current) cancelAnimationFrame(momentumID.current)

    setIsDragging(true)
    el.classList.add(styles.dragging)
    startX.current = e.pageX
    scrollStart.current = el.scrollLeft
    lastX.current = e.pageX
    lastTime.current = Date.now()
    moved.current = false
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const el = containerRef.current
    if (!el) return

    e.preventDefault()
    const x = e.pageX
    const dx = x - startX.current

    if (Math.abs(dx) > 5) moved.current = true
    el.scrollLeft = scrollStart.current - dx
    updateScroll()

    const now = Date.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      velocity.current = (x - lastX.current) / dt
      lastX.current = x
      lastTime.current = now
    }
  }

  const startMomentumScroll = () => {
    const el = containerRef.current
    if (!el) return

    const step = () => {
      el.scrollLeft -= velocity.current * 20
      velocity.current *= 0.95

      if (Math.abs(velocity.current) > 0.01) {
        momentumID.current = requestAnimationFrame(step)
      } else {
        momentumID.current = null
      }
      updateScroll()
    }

    momentumID.current = requestAnimationFrame(step)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    const el = containerRef.current
    if (!el) return

    setIsDragging(false)
    el.classList.remove(styles.dragging)
    startMomentumScroll()

    if (moved.current) preventClickRef.current = true
  }

  const handleClickCapture = (e: React.MouseEvent) => {
    if (preventClickRef.current) {
      e.stopPropagation()
      e.preventDefault()
      preventClickRef.current = false
    }
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.addEventListener('scroll', updateScroll)
    window.addEventListener('resize', updateScroll)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    updateScroll()

    return () => {
      el.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      if (momentumID.current) cancelAnimationFrame(momentumID.current)
    }
  }, [isDragging])

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {showArrows && canScrollLeft && (
        <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll('left')}>
          <span className={styles.arrowLeft}>‹</span>
        </button>
      )}
      <div
        ref={containerRef}
        className={`${styles.scrollContainer} ${isScrollable ? styles.scrollable : ''}`}
        onMouseDown={handleMouseDown}
        onClickCapture={handleClickCapture}
      >
        {children}
      </div>
      {showArrows && canScrollRight && (
        <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll('right')}>
          <span className={styles.arrowRight}>›</span>
        </button>
      )}
    </div>
  )
}
