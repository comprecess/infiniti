import { Skeleton, SkeletonText, Text, useTheme } from '@chakra-ui/react'

import styles from './CardPlanLoading.module.scss'
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner/LoadingSpinner'

export const CardPlanLoading = () => {
  const theme = useTheme()

  const skeletonStart = theme.colors.gray?.[400]
  const skeletonEnd = theme.colors.gray?.[500]

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
          <Text
            mt='12px'
            fontSize='14px'
            color='white'
            textAlign='center'
          >
            Converting your model...
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
