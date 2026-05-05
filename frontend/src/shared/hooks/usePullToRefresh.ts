import { useEffect, useRef, useState } from 'react'

interface Options {
  onRefresh: () => Promise<void> | void
  threshold?: number
  enabled?: boolean
}

export const usePullToRefresh = ({ onRefresh, threshold = 70, enabled = true }: Options) => {
  const startY = useRef(0)
  const pulling = useRef(false)
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const isRefreshing = useRef(false)

  useEffect(() => {
    if (!enabled) return

    // Find the scrollable container — works in both Safari and PWA
    const getScrollTop = () => {
      // In iOS PWA, document.documentElement.scrollTop or document.body.scrollTop
      return window.scrollY
        || document.documentElement.scrollTop
        || document.body.scrollTop
        || 0
    }

    const onTouchStart = (e: TouchEvent) => {
      if (getScrollTop() > 5) return  // small threshold to avoid sensitivity issues
      if (isRefreshing.current) return
      startY.current = e.touches[0].clientY
      pulling.current = true
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return
      const dy = e.touches[0].clientY - startY.current
      if (dy <= 0) {
        setPullY(0)
        return
      }
      // Rubber-band effect
      const rubberBand = dy < threshold ? dy : threshold + (dy - threshold) * 0.25
      setPullY(Math.min(rubberBand, threshold + 50))
    }

    const onTouchEnd = async () => {
      if (!pulling.current) return
      pulling.current = false

      setPullY(prev => {
        if (prev >= threshold && !isRefreshing.current) {
          isRefreshing.current = true
          setRefreshing(true)
          ;(async () => {
            try {
              await onRefresh()
            } finally {
              setRefreshing(false)
              isRefreshing.current = false
            }
          })()
          return 0
        }
        return 0
      })
    }

    // Use document for PWA compatibility (window events may not fire in some iOS PWA builds)
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [enabled, threshold, onRefresh])

  return { pullY, refreshing }
}
