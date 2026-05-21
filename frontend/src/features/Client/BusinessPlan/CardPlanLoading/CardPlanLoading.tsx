import { useEffect, useState } from 'react'

import { Skeleton, SkeletonText, Text, useTheme } from '@chakra-ui/react'

import styles from './CardPlanLoading.module.scss'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'
import { useAppWebSocket } from '../../../../shared/utils/providers/WebSocketProvider'

interface Props {
  planId?: number
}

const STEPS = [
  { until: 15,  label: 'Starting up...' },
  { until: 40,  label: 'Researching live market data...' },
  { until: 85,  label: 'Writing your investor-grade plan...' },
  { until: 99,  label: 'Saving sections...' },
  { until: 100, label: 'Done!' },
]

export const CardPlanLoading = ({ planId }: Props) => {
  const theme = useTheme()
  const { isConnected, isAuth, on } = useAppWebSocket()

  const [percent, setPercent] = useState(0)
  const [label, setLabel]     = useState('Preparing your plan...')

  // ── Simulated progress ───────────────────────────────────────────────────
  // Smoothly animate from 0 → 95% over ~150 s so the bar always moves.
  // Real WebSocket updates from the backend will snap it forward instantly.
  useEffect(() => {
    // Ticks: every 1.5 s advance ~0.6% (reaches 95% in ~142 s)
    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 95) { clearInterval(timer); return prev }
        const next = Math.min(prev + 0.6, 95)
        // Update label based on simulated percent
        const step = STEPS.find(s => next <= s.until)
        if (step) setLabel(step.label)
        return next
      })
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  // ── Real progress from WebSocket ─────────────────────────────────────────
  useEffect(() => {
    if (!isConnected || !isAuth) return

    const handler = (wsData: any) => {
      const data = wsData?.data ?? wsData
      // Only update if this event is for our plan
      if (planId && data?.planId && Number(data.planId) !== planId) return

      const p = Number(data?.percent ?? 0)
      const l = data?.label ?? ''

      if (p > 0) {
        setPercent(prev => Math.max(prev, p)) // never go backwards
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
