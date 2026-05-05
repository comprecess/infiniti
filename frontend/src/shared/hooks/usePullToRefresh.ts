import { useEffect, useRef, useState } from 'react'

interface Options {
  onRefresh: () => Promise<void> | void
  threshold?: number   // px to pull before triggering
  enabled?: boolean    // disable on desktop
}

export const usePullToRefresh = ({ onRefresh, threshold = 70, enabled = true }: Options) => {
  const startY = useRef(0)
  const [pulling, setPulling] = useState(false)
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const isRefreshing = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const onTouchStart = (e: TouchEvent) => {
      // Only trigger when scrolled to top
      if (window.scrollY > 0) return
      startY.current = e.touches[0].clientY
      setPulling(true)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling) return
      const dy = e.touches[0].clientY - startY.current
      if (dy < 0) { setPullY(0); return }
      // Rubber-band: slow down pull after threshold
      const rubberBand = dy < threshold ? dy : threshold + (dy - threshold) * 0.3
      setPullY(Math.min(rubberBand, threshold + 40))
    }

    const onTouchEnd = async () => {
      if (!pulling) return
      setPulling(false)

      if (pullY >= threshold && !isRefreshing.current) {
        isRefreshing.current = true
        setRefreshing(true)
        setPullY(0)
        try {
          await onRefresh()
        } finally {
          setRefreshing(false)
          isRefreshing.current = false
        }
      } else {
        setPullY(0)
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [enabled, pulling, pullY, threshold, onRefresh])

  return { pullY, refreshing }
}
