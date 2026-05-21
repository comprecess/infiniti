import { useEffect, useRef, useState } from 'react'

import { Skeleton, SkeletonText, Text, useTheme } from '@chakra-ui/react'

import styles from './CardPlanLoading.module.scss'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { useAppWebSocket } from '../../../../shared/utils/providers/WebSocketProvider'

interface Props {
  planId?: number
  onRefresh?: () => void  // called to reload the plans list (polling fallback)
}

const STEPS = [
  { until: 15,  label: 'Starting up...' },
  { until: 40,  label: 'Researching live market data...' },
  { until: 85,  label: 'Writing your investor-grade plan...' },
  { until: 99,  label: 'Saving sections...' },
  { until: 100, label: 'Done!' },
]

export const CardPlanLoading = ({ planId, onRefresh }: Props) => {
  const theme = useTheme()
  const { isConnected, isAuth, on } = useAppWebSocket()

  const [percent, setPercent] = useState(0)
  const [label, setLabel]     = useState('Preparing your plan...')
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  // ── Simulated progress ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 95) { clearInterval(timer); return prev }
        const next = Math.min(prev + 0.6, 95)
        const step = STEPS.find(s => next <= s.until)
        if (step) setLabel(step.label)
        return next
      })
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  // ── Polling fallback ─────────────────────────────────────────────────────
  // Every 15 s, call onRefresh so the list re-fetches from API.
  // This catches cases where WebSocket misses the completion event
  // (e.g. user navigated away and came back, or WS connection dropped).
  useEffect(() => {
    const poll = setInterval(() => {
      onRefreshRef.current?.()
    }, 15_000)
    return () => clearInterval(poll)
  }, [])

  // ── Real progress from WebSocket ─────────────────────────────────────────
  useEffect(() => {
    if (!isConnected || !isAuth) return

    const handler = (wsData: any) => {
      const data = wsData?.data ?? wsData
      if (planId && data?.planId && Number(data.planId) !== planId) return

      const p = Number(data?.percent ?? 0)
      const l = data?.label ?? ''

      if (p > 0) {
        setPercent(prev => Math.max(prev, p))
        if (l) setLabel(l)
      }
    }

    on('business-plan-progress', handler)
    return () => on('business-plan-progress', () => {})
  }, [isConnected, isAuth, on, planId])

  const skeletonStart = theme.colors.gray?.[400]
  const skeletonEnd   = theme.colors.gray?.[500]

  const displayPercent = Math.round(percent)

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoSkeleton}>
        <Skeleton
          startColor={skeletonStart}
          endColor={skeletonEnd}
          w='220px'
          h='220px'
          borderRadius='8px'
        />
        <div className={styles.spinnerWrapper}>
          <LoadingSpinner />
          <Text mt='8px' fontSize='14px' color='white' textAlign='center' fontWeight='600'>
            {displayPercent}%
          </Text>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.texts}>
          <Skeleton
            startColor={skeletonStart}
            endColor={skeletonEnd}
            height='36px'
            width='60%'
            borderRadius='4px'
          />
          <SkeletonText
            noOfLines={3}
            spacing='3'
            startColor={skeletonStart}
            endColor={skeletonEnd}
          />
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${displayPercent}%` }}
            />
          </div>
          <Text fontSize='12px' color='#9ea0b7' mt='6px'>
            {label}
          </Text>
        </div>

        <div className={styles.buttons}>
          <Skeleton
            startColor={skeletonStart}
            endColor={skeletonEnd}
            w='100px'
            h='48px'
            borderRadius='8px'
          />
          <Skeleton
            startColor={skeletonStart}
            endColor={skeletonEnd}
            w='100px'
            h='48px'
            borderRadius='8px'
          />
        </div>
      </div>
    </div>
  )
}
